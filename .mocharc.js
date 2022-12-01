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
        'src/**/*.spec.ts'
    ],
    exit: true
}