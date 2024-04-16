const Company = require("../models/Company");
const {getDataByQuery} = require("./egrul-nalog");

const toResponse = (x) => ({
    id: x._id.toString(),
    name: x.name,
    registerDate: x.registerDate,
    closeDate: x.closeDate,
    inn: x.inn,
    ogrn: x.ogrn,
})

async function getCompaniesByQuery(params) {
    const {search, page, limit, hasClosed, sort} = params
    const options = {
        page,
        limit,
        sort,
    };

    const list = await Company.paginate({
        $or: [
            {name: new RegExp(search, 'i')},
            {inn: new RegExp(search, 'i')}
        ],
        ...(hasClosed && {closeDate: {$ne: null}}),
    }, options)
    return {
        limit: list.limit,
        totalPages: list.totalPages,
        page: list.page,
        totalResults: list.totalDocs,
        results: list ? list.docs.map(toResponse) : []
    }
}

// Получение компаний по поисковому запросу
async function findOrCreateCompanies(search, page, limit, hasClosed, sort) {
    const params = {search, page, limit, hasClosed, sort}

    let companies = await getCompaniesByQuery(params)
    if (companies?.totalResults) {
        return companies
    }

    // Если ничего не найдено в бд, то получить и сохранить новые записи
    const results = await getDataByQuery(params.search);
    if (results?.length) {
        await addCompaniesIfNotExists(results);
    }

    return getCompaniesByQuery(params)
}

// Добавление новых компаний, если нет совпадения по ИНН
async function addCompaniesIfNotExists(companies) {
    for (const company of companies) {
        const existingCompany = await Company.findOne({inn: company.inn});
        if (!existingCompany) {
            await Company.create(company);
        }
    }
}

async function updateCompanyByINN(inn, updateData) {
    try {
        const updatedCompany = await Company.findOneAndUpdate({ inn }, updateData, {new: true, runValidators: true});
        if (!updatedCompany) {
            return { status: 404, data: 'Company not found' };
        }
        return { status: 200, data: toResponse(updatedCompany) };
    } catch (error) {
        console.error('Update error:', error);
        return { status: 500, data: 'Server error' };
    }
}

module.exports = {
    findOrCreateCompanies,
    updateCompanyByINN
};