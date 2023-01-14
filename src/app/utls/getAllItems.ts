/* eslint-disable @typescript-eslint/no-explicit-any */
const getAllItems = async (
    Model: any,
    query: Record<string, unknown>,
    searchableFields:string[],
    excludeFields: string[] = []
) => {
    const queryObject = { ...query };

    const excludeFieldsList = ["searchTerm", "page", "limit", "sortBy", "sortOrder", ...excludeFields];
    excludeFieldsList.forEach((value) => delete queryObject[value]);

    // const searchTerm = (query.searchTerm as string) || "";
    const sortBy = (query?.sortBy as string) || "createdAt";
    const sortOrder = query?.sortOrder === "desc" ? -1 : 1;
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;

    if (query.searchTerm && typeof query.searchTerm === "string" && query.searchTerm.trim() !== "") {
        queryObject.$or = searchableFields.map((field) => ({
            [field]: { $regex: query.searchTerm, $options: "i" },
        }));
    }

 

    const result = await Model.find(queryObject)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .populate("branch", "_id branchName");

    const total = await Model.countDocuments(queryObject);
    const totalPages = Math.ceil(total / limit);
    return { data: result, meta: { page, limit, total, totalPages } };
};

export default getAllItems;
