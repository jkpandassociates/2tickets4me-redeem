interface ApiError {
    source?: string;
    title: string;
    detail: string;
}

type ApiErrors = ApiError[];
