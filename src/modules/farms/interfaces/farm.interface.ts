export interface GetFarms {
    offset?: number;
    limit?: number;
    user: User;
    orderBy?: any;
    outliers?: boolean;
}

interface User {
    email: string;
    id: string;
}

export interface DeleteFarm {
    farmId: string;
    userId: string;
}
export interface CalculateOutliers{

}