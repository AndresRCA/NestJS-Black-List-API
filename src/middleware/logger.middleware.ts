import morgan from 'morgan'

export function request_logger() {
    const logging_mode = process.env.NODE_ENV === 'development' ? 'dev' : 'combined'
    return morgan(logging_mode)
}