package middleware

import (
	"net/http"
	"strings"

	"github.com/casbin/casbin/v2"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// CasbinMiddleware provides sub-millisecond RBAC enforcement for Gin/Go HTTP handlers
func CasbinMiddleware(e *casbin.Enforcer, jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Missing or malformed Authorization header (Bearer token required)",
			})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired JWT token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims structure"})
			c.Abort()
			return
		}

		username := claims["sub"].(string)
		role := claims["role"].(string)

		// Map HTTP method to action (GET -> read, POST/PUT/PATCH -> write, DELETE -> delete)
		act := "read"
		switch c.Request.Method {
		case http.MethodPost, http.MethodPut, http.MethodPatch:
			act = "write"
		case http.MethodDelete:
			act = "delete"
		}

		// Extract resource object from URL path (e.g., /api/v1/firewalls -> firewalls)
		pathParts := strings.Split(strings.Trim(c.Request.URL.Path, "/"), "/")
		obj := "servers"
		if len(pathParts) >= 3 {
			obj = pathParts[2]
		}

		// Sub-millisecond Casbin enforcement
		allowed, err := e.Enforce(username, obj, act)
		if err != nil || !allowed {
			c.JSON(http.StatusForbidden, gin.H{
				"error":     "Access Denied: Insufficient Role Permissions",
				"user":      username,
				"role":      role,
				"resource":  obj,
				"action":    act,
				"framework": "Casbin Least-Privilege Zero-Trust",
			})
			c.Abort()
			return
		}

		// Set user context for downstream handlers
		c.Set("username", username)
		c.Set("role", role)
		c.Next()
	}
}
