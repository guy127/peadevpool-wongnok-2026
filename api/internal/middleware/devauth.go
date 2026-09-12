package middleware

import (
	"log/slog"
	"net/http"
	"wongnok/internal/httputil"
	"wongnok/internal/reqctx"

	"github.com/gin-gonic/gin"
)

// DevAuth เป็น middleware สำหรับ development เท่านั้น ใช้แทน JWT ชั่วคราว
// เพื่อจะได้ยิง endpoint ที่ต้อง login ได้โดยไม่ต้องมี access token
//
// มันข้ามการ verify token ทั้งหมด แล้วยัด user ตาม uid ที่ส่งเข้ามาลง context
// ให้ handler อ่านผ่าน reqctx.UserID ได้เหมือนตอนใช้ JWT จริง
//
// ต้องมี user uid นี้อยู่ใน database ก่อน (รัน `go run ./cmd/seed`)
// ห้ามใช้ใน production เด็ดขาด
func DevAuth(userResolver UserResolver, uid string) gin.HandlerFunc {
	slog.Warn("auth guard bypassed: DevAuth middleware is active", "uid", uid)

	return func(ctx *gin.Context) {
		userID, err := userResolver.ResolveID(ctx.Request.Context(), uid)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, httputil.ErrorResponse{Message: "dev user not found, run `go run ./cmd/seed` first"})
			return
		}

		rctx := reqctx.WithSubject(ctx.Request.Context(), uid)
		rctx = reqctx.WithUserID(rctx, userID)
		ctx.Request = ctx.Request.WithContext(rctx)

		ctx.Next()
	}
}
