module.exports = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrationsTableName: process.env.MYSQL_MIGRATION_TABEL_NAME,
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: './src/migration',
  },
};
