#!/usr/bin/env node

import { ArgumentParser } from 'argparse';

const parser = new ArgumentParser({
    description: 'Rockr CLI Tool'
});

parser.add_argument('-d', '--dir', { help: 'directory containing service definition files' })
parser.add_argument('-f', '--file', { help: 'service definition file' })

const args = parser.parse_args()

console.log('cli tools works!')