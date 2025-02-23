"use client";

import { useRouter } from "next/router";

const useCustomRouter = () => {
    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(path);
    };

    return { navigateTo };
};

export default useCustomRouter;