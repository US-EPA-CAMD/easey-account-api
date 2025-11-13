import { LoggerOptions } from 'typeorm';

require('dotenv').config();
import { TlsOptions } from 'tls';
import { readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private tlsOptions: TlsOptions = { requestCert: true };

  constructor(private readonly configService: ConfigService) {
    const host = configService.get<string>('database.host');
    this.tlsOptions.rejectUnauthorized = (host !== 'localhost');
    this.tlsOptions.ca = (host !== 'localhost')
      ? readFileSync("./us-gov-west-1-bundle.pem").toString()
      : null;
    console.log('TLS/SSL Config:', {
      ...this.tlsOptions,
      ca: (this.tlsOptions.ca !== null)
        ? `${this.tlsOptions.ca.slice(0, 30)}...(truncated for display only)`
        : null
    });
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Values are: true | false | 'all' | 'query', 'error', 'schema', 'warn', 'info', 'log'
    const rawLogging = this.configService.get<string>('app.sqlLogging');
    const sqlLogging: LoggerOptions = rawLogging === 'false'
      ? false
      : rawLogging.split(',').map(level => level.trim()) as LoggerOptions;

    const commonConnectionConfig = {
      applicationName: this.configService.get<string>('app.name'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.pwd'),
      database: this.configService.get<string>('database.name'),
      ssl: this.tlsOptions,
    };

    const replicaHost = this.configService.get<string>('database.replicaHost');
    const mainHost = this.configService.get<string>('database.host');
    console.log("replicaHost", replicaHost)
    return {
      type: 'postgres',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: false,
      extra: {
        max: this.configService.get<number>('app.maxConnectionPool'),
        idleTimeoutMillis: this.configService.get<number>('app.idleTimeout'),
        connectionTimeoutMillis: this.configService.get<number>('app.connectionTimeout'),
        statement_timeout: this.configService.get<number>('app.statementTimeout'),
        idle_in_transaction_session_timeout: this.configService.get<number>('app.idleInTransactionSessionTimeout'),
        maxUses: this.configService.get<number>('app.maxUsesBeforeRecreatingConnection'),
      },
      // Enable SQL Logging. Values are: true | false | 'all' | ['query', 'error', 'schema', 'warn', 'info', 'log']
      logging: sqlLogging,
      // Logs queries exceeding this limit (does not terminate, 'statement_timeout' terminates them).
      maxQueryExecutionTime: this.configService.get<number>('app.maxQueryExecutionTime'),
      replication: {
        defaultMode: 'slave',
        master: { host: mainHost, ...commonConnectionConfig },
        slaves: [{ host: replicaHost, ...commonConnectionConfig }],
      },
    };
  }
}
