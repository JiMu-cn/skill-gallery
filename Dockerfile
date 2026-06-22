FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache zip

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制公共资源（图片和 skill 文件）
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 复制数据文件（运行时会被 volume 覆盖）
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

# 创建数据目录确保权限正确
RUN mkdir -p /app/data /app/public/images /app/public/skills \
    && chown -R nextjs:nodejs /app/data /app/public/images /app/public/skills

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATA_DIR="/app/data"
ENV IMAGES_DIR="/app/public/images"

CMD ["node", "server.js"]
