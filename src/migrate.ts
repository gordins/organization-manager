import { MigrationsBootstrap } from './bootstraps/migrations.bootstrap';
import { Context, Runtime } from './common/context';

new MigrationsBootstrap().run(new Context(Runtime.Migration));
