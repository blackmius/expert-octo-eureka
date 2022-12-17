function table(name, initial) {
    let storage = initial;
    try {
        storage = JSON.parse(localStorage[name]);
    } catch {}
    return Object.assign(storage, {
        create(obj) {
            obj.id ??= Math.max(...storage.map(o => o.id), -1)+1;
            storage.push(obj);
            this.update();
        },
        update() {
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
    { id: 1, topic: 'programming', name: 'Структуры и алгоритмы данных', disabled: true },
    { id: 2, topic: 'design', name: 'Введение в Figma', disabled: true },
    { id: 3, topic: 'design', name: 'Дизайн в AutoCad', disabled: true },
    { id: 4, topic: 'analitics', name: 'Системный аналитик', disabled: true },
    { id: 5, topic: 'analitics', name: 'Аналитик данных', disabled: true },
    { id: 6, topic: 'marketing', name: 'Маркетолог-аналитик', disabled: true },
    { id: 7, topic: 'marketing', name: 'Интернет-маркетолог', disabled: true },
    { id: 8, topic: 'management', name: 'Управление it-продуктами', disabled: true },
    { id: 9, topic: 'content', name: 'Менеджер контента', disabled: true },
]);

export const chapters = table('chapters', [
    { id: 0, courseId: 0, order: 0, name: 'Введение в язык C#' },
    { id: 1, courseId: 0, order: 1, name: 'Базовая структура. Вывод информации' },
    { id: 2, courseId: 0, order: 2, name: 'Переменные и типы данных' },
    { id: 3, courseId: 0, order: 3, name: 'Математические действия' },
])

export const lessons = table('lessons', [
    { id: 0, chapterId: 0, order: 0, name: 'На что способен с#', content: 'https://www.youtube.com/embed/_8yZYhAkQjQ?start=49&amp;clip=UgkxlzFVB2yIO-zQjYqpz-sbawN2dRhjuzSu&amp;clipt=ELiIBRjIzQg', task: ''},
    { id: 1, chapterId: 0, order: 1, name: 'установка visual studio', content: 'https://www.youtube.com/embed/_8yZYhAkQjQ?start=49&amp;clip=UgkxYRHPO_Q83PfiY6vPBTWeNIazR269XHSe&amp;clipt=ENDKFhiwnxo', task: ''},
    { id: 2, chapterId: 1, order: 0, name: 'Вывод информации', content: 'https://www.youtube.com/embed/3MireZUB3Hw?start=49&amp;clip=UgkxyIs4FRVnM7oTm4Q1-Oy7qH-oqvOPpbwe&amp;clipt=ENDwMxiwxTc', task: 'Создайте программу выводяющую "Привет мир" в терминал'},
    { id: 3, chapterId: 1, order: 1, name: 'Получение данных от пользователя', content: 'https://www.youtube.com/embed/3MireZUB3Hw?start=936', task: 'Напишите программу, в которой у пользователя запрашивают 2 числа и после выводится их сумма'},
    { id: 4, chapterId: 2, order: 0, name: 'Переменные и типы данных', content: 'https://www.youtube.com/embed/8q200PT8jTU', task: 'переведите строку в число, затем double, затем обратно в строку'},
    { id: 5, chapterId: 3, order: 0, name: 'Математические действия', content: 'https://www.youtube.com/embed/L4PkgGMJTgI?start=936', task: 'напишите программу вычисления корней квадратного уравнения'},
]);

export const users = table('users', [
    { id: 0, name: 'test', surname: 'test', patronym: 'test', login: 'test', password: 'test', email: 'test@test.test', address: 'test', phone: '0 000 000 00 00' },
    { id: 1, name: 'teacher', surname: 'test', patronym: 'test', login: 'teacher', password: 'teacher', email: 'teacher@test.test', address: 'test', phone: '0 000 000 00 00', isTeacher: true }
]);
export const userCourses = table('userCourses', [
    { userId: 0, courseId: 0 }
]);

export const answers = table('answerts', []);

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