import { spawn } from 'node:child_process'

const args = process.argv.slice(2)

const tasks = args.map((arg) => spawn('bun', [arg], { stdio: 'inherit' }))

tasks.forEach((task) => {
  task.on('close', () => {
    tasks.every((task) => task.kill())
    console.log('Exiting dev mode!')
    process.exit(0)
  })
})
