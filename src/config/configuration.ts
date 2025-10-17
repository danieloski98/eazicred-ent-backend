interface DatabaseConfig {
  uri: string;
}

interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  path: string;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export default (): {
  port: number;
  database: DatabaseConfig;
  swagger: SwaggerConfig;
  jwt: JwtConfig;
} => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/eazicred',
  },
  swagger: {
    title: 'EaziCred API',
    description: 'EaziCred API Documentation',
    version: '1.0',
    path: 'api',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
});
