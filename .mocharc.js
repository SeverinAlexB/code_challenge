module.exports = {
    require: [
        // 'source-map-support/register',
        'ts-node/register',
        // 'src/polyfils.ts',
        // 'reflect-metadata',
        'esm'
    ],
    extension: ['ts'],
    spec: [
        'test/**/*.ts',
        'src/**/*.spec.ts'
    ],
    exit: true
}