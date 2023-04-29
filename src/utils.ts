export function get_stage() {
    if (typeof window !== "undefined") {
        if (window?.location.href.includes("testing")) {
            return "testing";
        } else {
            return process.env.NODE_ENV as "production" | "development";
        }
    } else {
        return "testing";
    }
}