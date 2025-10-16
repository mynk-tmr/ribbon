import { spawn } from 'child_process'

const [...args] = process.argv.slice(2)

const jobs = args.map((arg) => spawn('bun', [arg], { stdio: 'inherit' }))

jobs.forEach((job) =>
  job.on('close', () => {
    jobs.forEach((job) => job.kill())
    console.log('Done !')
    process.exit(0)
  }),
)
