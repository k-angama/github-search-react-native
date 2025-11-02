import { UserResponseRaw, UsersResponseRaw } from "../data/UsersResponseRaw";

export interface UserEntity {
    id: string;
    nodeId: string;
    login: string;
    avatarUrl: string;
}

export const mapToUsersEntity = (raw: UsersResponseRaw): UserEntity[] => {
    return (raw.items ?? []).map((item) => mapToUserEntity(item)) || [];
}

const mapToUserEntity = (raw: UserResponseRaw): UserEntity => ({
    id: raw.id?.toString() ?? "",
    nodeId: raw.node_id ?? "",
    login: raw.login ?? "",
    avatarUrl: raw.avatar_url ?? "",
});