# Skill Gallery 部署指南

## Docker 部署

### 1. 准备服务器

- 安装 Docker 和 Docker Compose
- 开放 80/443 端口

### 2. 上传项目到服务器

```bash
git clone <your-repo> skill-gallery
cd skill-gallery
```

### 3. 配置环境变量

```bash
cp .env.example .env
vim .env
```

`.env` 内容：
```bash
# 生成强随机 token
# openssl rand -hex 32
ADMIN_TOKEN=<生成的强随机token>

# 开启 HTTPS 强制检查（配好 SSL 证书后启用）
REQUIRE_HTTPS=true

# 允许跨域的来源域名（逗号分隔），* 表示允许所有
# 如需限制: https://client1.com,https://client2.com
ALLOWED_ORIGINS=*
```

### 4. 配置 SSL 证书（推荐）

将证书文件放入 `nginx/certs/`：
```
nginx/certs/fullchain.pem
nginx/certs/privkey.pem
```

编辑 `nginx/nginx.conf`，取消 SSL 相关注释。

### 5. 首次部署

```bash
docker compose up -d --build
```

### 6. 初始化数据

首次启动后，volume 是空的，需要把初始数据复制进去：

```bash
# 复制数据文件
docker cp data/skills.json skill-gallery-app:/app/data/
docker cp data/likes.json skill-gallery-app:/app/data/

# 复制图片
docker cp public/images/. skill-gallery-app:/app/public/images/

# 复制 skill 下载文件
docker cp public/skills/. skill-gallery-app:/app/public/skills/
```

### 7. 验证

```bash
curl http://your-domain.com/api/skills?page=1&limit=1
```

---

## API 接口文档

### 公开接口（允许跨域）

| 接口 | 方法 | 用途 | 跨域 |
|------|------|------|------|
| `/api/skills` | GET | 获取案例列表（分页+筛选+点赞数） | ✅ |
| `/api/like` | GET | 批量获取点赞数 | ✅ |
| `/api/like` | POST | 点赞/取消点赞 | ✅ |
| `/images/*` | GET | 案例图片资源 | ✅ |
| `/skills/*` | GET | Skill 文件下载 | ✅ |

### 管理接口（需要 Token）

| 接口 | 方法 | 用途 | 认证 |
|------|------|------|------|
| `/api/admin/add-case` | POST | 添加新案例（热更新） | Bearer Token |

---

### GET /api/skills

获取案例列表，支持分页和筛选。

**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | number | 1 | 页码 |
| limit | number | 9 | 每页数量（max 50） |
| category | string | All | 分类筛选 |
| style | string | All | 风格筛选 |
| scene | string | All | 场景筛选 |
| search | string | "" | 搜索关键词 |

**响应：**
```json
{
  "items": [
    {
      "id": "skill-401",
      "title": "超写实城市文旅宣传海报",
      "image": "/images/skill-401.webp",
      "category": "Posters & Typography",
      "style": "Poster",
      "scene": "Travel",
      "fileSize": 146012,
      "downloads": 0,
      "likes": 5
    }
  ],
  "total": 401,
  "page": 1,
  "limit": 9,
  "hasMore": true
}
```

---

### POST /api/like

点赞或取消点赞。

**请求体：**
```json
{ "id": "skill-401", "action": "like" }
```
action: `"like"` 或 `"unlike"`

**响应：**
```json
{ "id": "skill-401", "likes": 6 }
```

**Rate Limit：** 每个 IP 每分钟最多 30 次

---

### POST /api/admin/add-case

添加新案例（热更新，无需 rebuild）。

**Headers：**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Body (multipart/form-data)：**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| image | File | 是 | WebP/PNG/JPEG, max 10MB |
| title | string | 是 | 标题（max 100字符，全局唯一） |
| category | string | 是 | 分类（必须为合法枚举值） |
| style | string | 是 | 风格（必须为合法枚举值） |
| scene | string | 是 | 场景（必须为合法枚举值） |

**合法枚举值：**

Category: `UI & Interfaces`, `Charts & Infographics`, `Posters & Typography`, `Products & E-commerce`, `Brand & Logos`, `Architecture & Spaces`, `Photography & Realism`, `Illustration & Art`, `Characters & People`, `Scenes & Storytelling`, `History & Classical Themes`, `Documents & Publishing`, `Other Use Cases`

Style: `3D`, `Architecture`, `Brand`, `Character`, `Characters`, `Charts`, `Classical`, `Documents`, `History`, `Illustration`, `Infographic`, `Other Use Cases`, `Photography`, `Poster`, `Product`, `Products`, `Realistic`, `Scenes`, `UI`

Scene: `Creative`, `Tech`, `Commerce`, `Education`, `Social`, `Fashion`, `Food`, `Travel`, `Story`, `History`

**响应：**
```json
{
  "success": true,
  "skill": { "id": "skill-402", "title": "...", ... },
  "message": "案例 \"xxx\" 已添加，编号 skill-402"
}
```

---

## 安全措施

| 措施 | 说明 |
|------|------|
| Token 认证 | 管理接口需要 Bearer Token，从环境变量读取 |
| HTTPS 强制 | `REQUIRE_HTTPS=true` 时拒绝 HTTP 请求 |
| CORS 控制 | `ALLOWED_ORIGINS` 控制允许的跨域来源 |
| 数据校验 | category/style/scene 枚举校验，图片格式和大小校验 |
| Rate Limit | 点赞接口每 IP 每分钟 30 次上限 |
| 错误隐藏 | 500 错误不暴露内部细节 |
| .env 保护 | .gitignore 排除 .env 文件 |

---

## 架构说明

```
客户端请求 → Nginx (80/443)
               ├── /images/*        → Docker volume (gallery-images) 直出 + CORS
               ├── /skills/*        → Docker volume (gallery-skills) 直出 + CORS
               ├── /api/admin/*     → Next.js (Token 验证 → 写入 volume)
               ├── /api/skills      → Next.js (读取 volume + CORS)
               ├── /api/like        → Next.js (读写 volume + CORS + Rate Limit)
               └── /*               → Next.js (页面渲染)
```

### Docker Volumes

| Volume | 用途 | 说明 |
|--------|------|------|
| gallery-data | skills.json + likes.json | 案例数据和点赞数据 |
| gallery-images | WebP 图片 | Nginx 直出 + API 写入 |
| gallery-skills | Skill 下载文件 | Nginx 直出 |

---

## 常用命令

```bash
# 首次部署
docker compose up -d --build

# 查看日志
docker compose logs -f app
docker compose logs -f nginx

# 重启
docker compose restart

# 停止
docker compose down

# 代码更新后重建（不丢数据）
git pull && docker compose up -d --build

# 备份数据
docker cp skill-gallery-app:/app/data ./backup-data
docker cp skill-gallery-app:/app/public/images ./backup-images

# 添加新案例（热更新）
curl -X POST https://your-domain.com/api/admin/add-case \
  -H "Authorization: Bearer <token>" \
  -F "image=@image.webp" \
  -F "title=案例标题" \
  -F "category=Charts & Infographics" \
  -F "style=Infographic" \
  -F "scene=Tech"
```

---

## 第三方客户端接入

其他域名的客户端可以直接调用以下接口：

```javascript
// 获取案例列表
const res = await fetch('https://your-domain.com/api/skills?page=1&limit=9');
const data = await res.json();

// 图片 URL 拼接
const imageUrl = `https://your-domain.com${item.image}`;

// 点赞
await fetch('https://your-domain.com/api/like', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 'skill-401', action: 'like' })
});
```

如需限制来源域名，修改 `.env` 中的 `ALLOWED_ORIGINS`：
```
ALLOWED_ORIGINS=https://client1.com,https://client2.com
```
