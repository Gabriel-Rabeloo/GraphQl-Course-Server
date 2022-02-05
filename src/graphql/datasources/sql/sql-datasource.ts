import { DataSource } from 'apollo-datasource';
import { InMemoryLRUCache, KeyValueCache } from 'apollo-server-caching';
import DataLoader from 'dataloader';
import { Context } from '../../../interfaces/simpleTypes';

interface DataSourceConfig<TContext> {
  context: TContext;
  cache: KeyValueCache;
}

export abstract class SQLDataSource extends DataSource {
  db: any;
  context: Context | Record<string, unknown> = {};
  cache: KeyValueCache = new InMemoryLRUCache();
  private _loader: any;

  constructor(dbConnection: any) {
    super();
    this.db = dbConnection;
    this._loader = new DataLoader(async (ids: readonly string[]) => this.batchLoaderCallback(ids));
  }

  initialize({ context, cache }: DataSourceConfig<Context>) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache();
  }

  async batchLoad(id: string) {
    return this._loader.load(id);
  }

  async batchLoaderCallback(_ids: readonly string[]) {
    return _ids;
  }
}
