function table(name, initial) {
    let storage = initial;
    try {
        storage = JSON.parse(localStorage[name]);
    } catch {}
    return Object.assign(storage, {
        create(obj) {
            obj.id ??= Math.max(...storage.map(o => o.id), -1)+1;
            storage.push(obj);
            localStorage[name] = JSON.stringify(storage);
        }
    })
}

export const topics = table('topics', [
    { id: 'programming', name: 'Программирование' },
    { id: 'design', name: 'Дизайн' },
    { id: 'analitics', name: 'Аналитика' },
    { id: 'management', name: 'Управление' },
    { id: 'marketing', name: 'Маркетинг' },
    { id: 'content', name: 'Создание контента' },
]);

export const courses = table('courses', [
    { id: 0, topic: 'programming', name: 'Программирование на c#' },
    { id: 1, topic: 'programming', name: 'Структуры и алгоритмы данных' },
    { id: 2, topic: 'design', name: 'Введение в Figma' },
    { id: 3, topic: 'design', name: 'Дизайн в AutoCad' },
    { id: 4, topic: 'analitics', name: 'Системный аналитик' },
    { id: 5, topic: 'analitics', name: 'Аналитик данных' },
    { id: 6, topic: 'marketing', name: 'Маркетолог-аналитик' },
    { id: 7, topic: 'marketing', name: 'Интернет-маркетолог' },
    { id: 8, topic: 'management', name: 'Управление it-продуктами' },
    { id: 9, topic: 'content', name: 'Менеджер контента' },
]);

export const users = table('users', [
    { id: 0, name: 'test', surname: 'test', patronym: 'test', login: 'test', password: 'test', email: 'test@test.test', address: 'test', phone: '0 000 000 00 00' }
]);
export const userCourses = table('userCourses', [
    { userId: 0, courseId: 0 }
]);

export function groupBy(table, field) {
    const obj = {};
    table.forEach(row => {
        const val = row[field]
        if (!(val in obj)) {
            obj[val] = [];
        }
        obj[val].push(row);
    });
    return Object.entries(obj);
}