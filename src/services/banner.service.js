import { get } from "./request"

export const BannerService = {
    getBanners: async () => {
        const response = get("banners")

        if (!response) {
            throw new Error("Failed to fetch banners")
        }
        return response
    },
    getBannersByType: async (type) => {
        const response = get(`banners?type=${type}`)
        if (!response) {
            throw new Error("Failed to fetch banners")
        }
        return response
    }
}