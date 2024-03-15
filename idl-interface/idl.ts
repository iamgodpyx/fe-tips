#!/usr/bin/env node

import * as yargs from 'yargs';
import * as shell from 'shelljs';
import { genDts } from '@byted/dts-from-dsl';
import * as fs from 'fs';

const argv: any = yargs
    .option('branch', {
        alias: 'b',
        describe: '设置拉取IDL仓库的分支',
        default: 'master',
        demandOption: false,
    })
    .option('config', {
        alias: 'c',
        describe: '指定thrift配置文件',
        default: '',
        demandOption: true,
        type: 'string',
    })
    .option('dir', {
        alias: 'd',
        describe: 'TS类型文件存放目录，默认typings',
        default: '',
        demandOption: false,
        type: 'string',
    })
    .option('move', {
        alias: 'm',
        describe: '是否需要移动生成文件',
        default: true,
        demandOption: false,
        type: 'boolean',
    })
    .help('h')
    .alias('h', 'help')
    .version('v')
    .alias('v', 'version')
    .parse();

// service_rpc_idl目录
const IDL_PATH = 'idl';
// 类型目录
const TYPINGS_PATH = argv.dir || 'typings';
// thrift文件列表
let FILES: string[] = [];

if (shell.test('-f', argv.config)) {
    const data = fs.readFileSync(argv.config).toString();
    FILES = JSON.parse(data).idlArr;
}

const setIDLIgnore = () => {
    if (shell.test('-f', '.gitignore')) {
        const str = shell.grep(IDL_PATH, '.gitignore').toString().trim();
        if (!str.length) {
            shell.echo(IDL_PATH).toEnd('.gitignore');
        }
    } else {
        shell.touch('.gitignore');
        shell.echo(IDL_PATH).toEnd('.gitignore');
    }
};

setIDLIgnore();

// 打包拉取指定文件
shell.exec(
    `npx @byted/idl_download -r git@code.byted.org:novel/rpc_idl.git -d ${IDL_PATH} -b ${argv.branch} ${FILES.join(
        ' ',
    )}`,
);

shell.rm('-rf', `${TYPINGS_PATH}/*`);

// 生成TS
genDts(FILES, {
    rootDir: IDL_PATH,
    int64: fieldName => {
        return /id$/i.test(fieldName) ? 'string' : 'number';
    },
    useKey: true,
    exportDeps: false, // 不导出依赖类型
    ignoreFieldName: 'CommonParam',
    outDir: TYPINGS_PATH,
});

if (argv.move) {
    const novelPath = `${TYPINGS_PATH}/novel/`;
    const originPath = `${TYPINGS_PATH}/novel_origin/`;

    if (!shell.test('-e', novelPath)) {
        shell.mkdir(novelPath);
    }
    shell.cp('-r', `${originPath}*`, novelPath);
    shell.rm('-rf', originPath);
}
