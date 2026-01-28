export function parseDuration(durationStr: string){
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if(!match ){
        throw new Error(`Invalid duration format: ${durationStr}`);
    }

    const value = Number(match[1]);
    const unit = match[2];

    let duration = 0;

    switch(unit){
        case "ms":
            duration = value;
            break;
        case "s":
            duration = value * 1000;
            break;
        case "m":
            duration = value * 60 * 1000;
            break;
        case "h":
            duration = value * 3600 * 1000;
            break;
        default:
            // Should be unreachable due to regex, but provides small protection against future changes
            throw new Error(`Unsupported time unit: ${unit}`);
    }

    return duration;
}