class ValidationError extends Error {
    constructor(message, options={}){
        super(message);
        this.name = this.constructor.name;
        this.code = options?.code ?? "APP_ERROR";
        this.data = options.data;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

class ChronologyError extends ValidationError {
    constructor(message, data) {
        super(message, data);
        this.code = "CHRONOLOGY";
    }
}

class TimestampParseError extends ValidationError {
    constructor(message, data) {
        super(message, data);
        this.code = "PARSE_TIMESTAMP";
    }
}

module.exports = { ValidationError, ChronologyError, TimestampParseError };