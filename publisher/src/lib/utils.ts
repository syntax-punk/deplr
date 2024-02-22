import { greenBright, green, redBright, red } from "colorette"
import { exec } from 'child_process';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function buildProject(target: string) {
  return new Promise((resolve) => {
      const child = exec(`cd ${target} && npm install && npm run build`)

      child.stdout?.on('data', function(data) {
          console.log(`${greenBright('> building: ')}`,  green(data));
      });
      child.stderr?.on('data', function(data) {
        console.log(`${redBright('! error: ')}`, red(data));
      });

      child.on('close', function(code) {
         resolve(true)
      });
  })
}
