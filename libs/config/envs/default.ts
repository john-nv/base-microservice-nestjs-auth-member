export const config = {
  rootApi: 'api',
  mainConfigId: process.env.MAIN_CONFIG_ID || 'default126dGs584ESY3',
  initAccount: {
    username: process.env.INIT_ADMIN_USERNAME || 'admin',
    password: process.env.INIT_ADMIN_PWD || 'password',
    exchangePassword: process.env.INIT_ADMIN_EX_PWD || 'expassword',
    phone: process.env.INIT_ADMIN_PHONE || '0123456789',
    role: process.env.INIT_ADMIN_ROLE || 'admin',
  },
  db: {
    postgres: {
      type: process.env.DB_TYPE || 'postgres',
      synchronize: false,
      logging: process.env.ENV !== 'develop' ? true : false,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'username',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB || 'admin',
      extra: {
        connectionLimit: 10,
      },
      autoLoadEntities: true,
      poolSize: 10,
      connectTimeoutMS: 2000,
      caches: true,
    },
    mongodb: {
      uri: `mongodb://${process.env.DB_MONGO_USER || 'root'}:${
        process.env.DB_MONGO_PASSWORD || 'password'
      }@${process.env.DB_MONGO_HOST || 'localhost'}:${
        process.env.DB_MONGO_PORT || 27017
      }?directConnection=true`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  cache: {
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PWD || 'password',
    host: process.env.REDIS_HOST || '127.0.0.1',
  },
  jwt: {
    jwtSecretExpirePeriod: process.env.JWT_SECRET_EXPIRE_PERIOD || 1,
    jwtSecretExpireDigit: process.env.JWT_SECRET_EXPIRE_DIGIT || 'day',
    jwtRefreshSecretExpirePeriod:
      process.env.JWT_REFRESH_SECRET_EXPIRE_PERIOD || 7,
    jwtRefreshSecretExpireDigit:
      process.env.JWT_REFRESH_SECRET_EXPIRE_DIGIT || 'day',
  },
  services: {
    adminGateway: {
      port: process.env.ADMIN_GATEWAY_PORT || 3000,
    },
    userGateway: {
      port: process.env.USER_GATEWAY_PORT || 3030,
    },
    authService: {
      transport: 0,
      options: {
        host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
        port: process.env.AUTH_SERVICE_PORT || 3001,
      },
    },
    memberService: {
      transport: 0,
      options: {
        host: process.env.MEMBER_SERVICE_HOST || '0.0.0.0',
        port: process.env.MEMBER_SERVICE_PORT || 3003,
      },
    },
  },
};
