export interface IpaginatedResult {
    modelname: any
    filter: any
    populate: []
    page: number
    pageSize: number
    select?: string
    isLean?: boolean
    order_by?: string | boolean | any
}

interface ICustomPaginatedResult {
    data: any
    page: number
    pageSize: number
}

const getPaginatedResult = async ({
    modelname,
    filter,
    populate,
    page,
    pageSize,
    select,
    isLean,
    order_by,
}: IpaginatedResult) => {
    const result = {
        data: [],
        total: 0,
        currentPage: page,
        perPage: pageSize,
        lastPage: 0,
        hasMorePages: false,
        nextPage: 0,
        previousPage: 0,
    }

    if (!order_by) {
        order_by = { createdAt: -1 }
    }

    let data: any
    if (isLean) {
        data = await modelname
            .find({ ...filter })
            .populate([...populate])
            .select(select)
            .lean()
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort(order_by)
    } else {
        data = await modelname
            .find({ ...filter })
            .populate([...populate])
            .select(select)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort(order_by)
    }

    const total = await modelname.find(filter).count()

    result.data = data
    result.total = total
    result.currentPage = page
    result.lastPage = Math.ceil(total / pageSize)
    result.hasMorePages = result.lastPage > result.currentPage ? true : false
    result.nextPage = result.lastPage > result.currentPage ? result.currentPage + 1 : 0
    result.previousPage = result.currentPage > 1 ? result.currentPage - 1 : 0

    return result
}

const customPaginatedResult = ({ data, page, pageSize }: ICustomPaginatedResult) => {
    const result = {
        data: [],
        total: 0,
        currentPage: data.page,
        perPage: data.pageSize,
        lastPage: 0,
        hasMorePages: false,
        nextPage: 0,
        previousPage: 0,
    }

    const totalData = data.length
    const currentPage = page
    const lastPage = Math.ceil(data.length / pageSize)
    const hasMorePages = currentPage < lastPage
    const nextPage = hasMorePages ? currentPage + 1 : 0 // null
    const previousPage = currentPage > 1 ? currentPage - 1 : 0 // null

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize - 1, totalData - 1)
    const resultData = data.slice(startIndex, endIndex + 1)

    result.data = resultData
    result.total = totalData
    result.currentPage = currentPage
    result.lastPage = lastPage
    result.hasMorePages = hasMorePages
    result.nextPage = nextPage
    result.previousPage = previousPage

    return result
}

export { getPaginatedResult, customPaginatedResult }