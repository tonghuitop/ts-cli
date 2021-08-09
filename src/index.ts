import { program } from 'commander'
import create from './order/create'

program
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .version(`${require('../package.json').version}`, '-v --version')
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('Create new project from => ts-cli create yourProjectName')
  .action(async (name: string) => {
    await create(name)
  })

program.parse(process.argv)
