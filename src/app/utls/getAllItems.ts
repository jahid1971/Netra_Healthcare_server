/* eslint-disable @typescript-eslint/no-explicit-any */
const getAllItems = async (
    Model: any,
    query: Record<string, unknown>,
    options: { searchableFields: string[]; filterableFields: string[] }
) => {
    const sortBy = (query?.sortBy as string) || "createdAt";
    const sortOrder = query?.sortOrder === "desc" ? "desc" : "asc";
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;

    const andConditions = [];

    if (
        query.searchTerm &&
        typeof query.searchTerm === "string" &&
        query.searchTerm.trim() !== ""
    ) {
        andConditions.push({
            OR: options.searchableFields.map((field) => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    const filterObject = options.filterableFields.reduce(
        (acc: Record<string, unknown>, field) => {
            if (query[field]) acc[field] = query[field];
            return acc;
        },
        {}
    );

    if (Object.keys(filterObject).length > 0) {
        andConditions.push({
            AND: Object.keys(filterObject).map((key) => {
                return {
                    [key]: {
                        equals: (filterObject as any)[key],
                    },
                };
            }),
        });
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await Model.findMany({
        where: whereConditions,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await Model.count({ where: whereConditions });

    return {
        data: result,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export default getAllItems;
