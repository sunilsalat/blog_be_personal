import helmet from "helmet";

export const hlm = helmet({
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'", "example.com"],
            "img-src": ["'self'", "example.com"],
        },
    },
});
