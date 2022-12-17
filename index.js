import 'virtual:windi.css';

import { c, attr, key, prop, on, cls, css } from './combinator.js';
import { body, Val, Ref } from './collibri.js';

import programmerImageUrl from './assets/Programmer.png';
import designerImageUrl from './assets/GridDesign.png';
import analiticsImageUrl from './assets/SocialDashboard.png';
import managementImageUrl from './assets/TeamSpirit.png';
import marketingImageUrl from './assets/MobileMarketing.png';
import contentImageUrl from './assets/Content.png';
import mainImageUrl from './assets/mainIcon.png';
import complitedImageUrl from './assets/complited.png';

import * as data from './data.js';

function tw([text]) {
    return parent => text.split(' ').filter(i=>i).forEach(cls => parent.data.classes.add(cls));
}

function HeaderLink(name, href, fn) {
    return c.A(tw`text-[16px] leading-[22px] cursor-pointer`, attr.href(href), on.click(fn), name);
}

function Link(name, href) {
    return c.A(tw`text-[14px] leading-[22px] cursor-pointer hover:text-[#0000004c] transition-all`, attr.href(href), name);
}

function TextLink(text, href) {
    return c.A(tw`border-b-2 cursor-pointer transition-all hover:border-[#0047ff] hover:text-[#0047ff]`, attr.href(href), text);
}

function Page(...children) {
    return c(
        tw`max-w-[1280px] m-auto p-[55px]`,
        Header,
        c(tw`mt-[46px]`),
        ...children,
        c(tw`mt-[96px]`),
        Footer
    );
}

function BlueButton(text, fn) {
    return c.Button(tw`rounded-full bg-[#0089EF] text-[18px] text-white leading-[29px] font-bold px-[84px] py-[9px]`, on.click(fn), text);
}

let _currentUser = Number(localStorage.currentUser)
const currentUser = Val(Number.isNaN(_currentUser) ? null : _currentUser).on(val => localStorage.currentUser = val);

const Header = c.Header(
    tw`flex flex-row gap-[36px]`,
    c(tw`flex-1`),
    _ => {
        let user = currentUser();
        if (user) {
            user = data.users.find(u => u.id === user);
        }
        return [
            !user?.isTeacher && [
                HeaderLink('Все программы', '#courses'),
                HeaderLink('Задать вопрос', '#ask')
            ],
            user == undefined ?
                [
                    HeaderLink('Регистрация', '#register'),
                    HeaderLink('Авторизация', '#login'),
                ]
            : HeaderLink('Мои курсы', '#courses/my'),
        ]
    }
);

const Footer = c.Footer(
    c(tw`flex gap-[30px]`,
        Link('О нас', '#'),
        Link('Контакты', '#contacts'),
    ),
    c(tw`mt-[33px]`),
    c.Hr(tw`w-full border-[#d9d9d9] border-t`),
    c(tw`mt-[33px]`),
    c(tw`flex gap-[40px] justify-between`,
        c.Span(tw`text-[16px] leading-[22px] text-[#0000004c]`, '© 2022 фабриканавыков.ру'),
        Link('Авторизация для преподавателей', '#login'),
        Link('Политика конфиденциальности', '#privacy'),
        Link('Пользовательское соглашение', '#agreement'),
    ),
);

const MainHeader = c.Section(
    tw`flex flex-row`,
    c(
        c.H1(tw`text-[60px] font-bold leading-[68px] w-[400px]`, 'Фабрика навыков'),
        c(tw`mt-[96px]`),
        c.p(tw`w-[425px] text-[18px] leading-[25px]`, 'Мы — Образовательная онлайн платформа “Фабрика навыков”. Наша цель - обеспечить  удаленный доступ к получению знаний, навыков и беспрерывную возможность обучаться.')
    ),
    c(tw`flex-1`),
    c(c.Img(attr.src(mainImageUrl)))
);

function Section(name, img, href) {
    return c.A(tw`rounded-[19px] flex p-[26px] bg-[#00000008] cursor-pointer transition-all hover:bg-[#0000001c] hover:brightness-90`,
        attr.href('#courses/'+href),
        c(tw`font-medium text-[18px] leading-[21px]`, name),
        c(tw`flex-1`),
        c.Img(attr.src(img))
    );
}

const SectionsList = c.Section(
    tw`rounded-[37px] shadow border border-[#dcdcdc] p-[28px] bg-white`,
    c.H1(tw`font-semibold text-[28px] leading-[68px]`, 'Направления программ'),
    c(tw`grid grid-cols-2 gap-[28px] mt-[27px]`,
        Section('Программирование', programmerImageUrl, 'programming'), Section('Управление', managementImageUrl, 'management'),
        Section('Дизайн', designerImageUrl, 'design'), Section('Маркетинг', marketingImageUrl, 'marketing'),
        Section('Аналитика', analiticsImageUrl, 'analitics'), Section('Создание контента', contentImageUrl, 'content'),
    )
);

const MainPage = Page(
    MainHeader,
    c(tw`mt-[72px]`),
    SectionsList
);

function TitledInput(name, val, ...modifiers) {
    return c(tw`flex-1`,
        c(tw`text-center text-[#000000c0] text-[18px] leading-[34px] `, name),
        c.Input(
            tw`h-[48px] w-full rounded-full border border-[#dcdcdc] shadow text-[16px] px-[24px]`,
            on.input(e => val(e.target.value)),
            modifiers
        ),
    )
}

function TextInput(val) {
    return c.Textarea(
        tw`w-full resize-y rounded-[24px] min-h-[120px] border border-[#dcdcdc] text-[16px] px-[24px] py-[24px]`,
        prop.value(val),
        on.input(e => val(e.target.value))
    )
}

function ModalPage(name, ...content) {
    return Page(
        c.Section(
            tw`max-w-[740px] m-auto`,
            c.flex.justifyCenter(
                c.Img(tw`w-[196px]`, attr.src(mainImageUrl)),
            ),
            c.Section(tw`px-[96px] border shadowed border-[#dcdcdc] rounded-[37px] py-[32px] bg-white`,
                c.H1(tw`text-shadow-1 font-bold text-[48px] leading-[48px] text-[#00000099] text-center`, name),
                c(tw`mt-[19px]`),
                ...content
            )
        )
    )
}

function Login() {
    const form = {};
    const error = Val('');
    return ModalPage('Авторизация',
        c.Form(
            on.submit(e => {
                e.preventDefault();
                const user = data.users.find(u => u.login === form.login && u.password === form.password);
                if (user) {
                    currentUser(user.id);
                    document.location.hash = '#courses/my'
                } else {
                    error('Логин не найден или пароль не подходит');
                }
                return false;
            }),
            TitledInput('Логин', Ref(form, 'login')),
            c(tw`mt-[25px]`),
            TitledInput('Пароль', Ref(form, 'password'), attr.type('password')),
            c(tw`mt-[25px]`),
            c(tw`text-center text-[#ff0000] text-[18px] leading-[34px]`, error),
            c(tw`mt-[25px]`),
            c(tw`flex justify-center`, BlueButton('Войти')),
            c.P(tw`mt-[20px] text-[#00000099] text-[18px] leading-[34px] text-center w-[487px] m-auto`, 'Если у вас нет аккаунта',
                c.Br(),
                TextLink('зарегистрируйтесь', '#register')
            )
        )
    );
}

function Register() {
    const form = {name: '', surname: '', patronym: '', login: '', email: '', phone: '', password: ''};
    const error = Val('');
    return ModalPage('Регистрация',
        c.Form(
            on.submit(e => {
                e.preventDefault();
                if (data.users.find(u => u.login === form.login)) {
                    return error('Пользователь с таким логином уже существует');
                }
                if (data.users.find(u => u.email === form.email)) {
                    return error('Пользователь с таким почтовым адресов уже существует');
                }
                if (Object.values(form).some(v => v.trim() === '')) {
                    return error('Все поля обязательны к заполнению');
                }
                if (form.password !== form.passwordRepeat) {
                    return error('Указанные пароли не совпадают');
                }
                data.users.create({
                    name: form.name, surname: form.surname, patronym: form.patronym,
                    login: form.login, email: form.email, password: form.password,
                    phone: form.phone
                });
                document.location.hash = '#login';
                return false
            }),
            c(tw`flex gap-[16px]`,
                TitledInput('Имя', Ref(form, 'name')),
                TitledInput('Фамилия', Ref(form, 'surname')),
                TitledInput('Отчество', Ref(form, 'patronym')),
            ),
            c(tw`flex gap-[8px]`,
                TitledInput('Логин', Ref(form, 'login')),
                TitledInput('Почта', Ref(form, 'email')),
            ),
            TitledInput('Телефон', Ref(form, 'phone')),
            c(tw`flex gap-[8px]`,
                TitledInput('Пароль', Ref(form, 'password')),
                TitledInput('Повторите пароль', Ref(form, 'passwordRepeat')),
            ),
            c(tw`mt-[25px]`),
            c(tw`text-center text-[#ff0000] text-[18px] leading-[34px]`, error),
            c(tw`mt-[25px]`),
            c(tw`flex justify-center`,
                BlueButton('Зарегистироваться')
            ),
            c.P(tw`mt-[20px] text-[#00000099] text-[18px] leading-[34px] text-center w-[487px] m-auto`, 'У меня уже есть аккаунт ',
                TextLink('войти', '#login')
            )
        )
    );
}

const AskQuestion = ModalPage('Задать вопрос',
    TextInput(),
    c(tw`mt-[25px]`),
    c(tw`flex justify-center`,
        BlueButton('Отправить')
    )
);

const PrivacyPolicy = ModalPage('Политика конфиденциальности');
const UserAgreements = ModalPage('Пользовательское соглашение');
const Contacts = ModalPage('Контакты');

function RowHeader(text) {
    return c(tw`text-[28px] leading-[68px] font-semibold border-b-4 border-black pl-[26px]`, text);
}

function DisabledCardButton(text) {
    return c.Button(
        tw`bg-[#a5a5a5] text-[#ffffff63] text-[20px] leading-[29px] font-bold p-[8px] min-w-[240px] max-w-[390px] rounded-full cursor-default`,
        text
    );
}

function CardButton(text, fn) {
    return c.Button(
        tw`bg-[#57DE28] text-white text-[20px] leading-[29px] font-bold p-[8px] min-w-[240px] max-w-[390px] rounded-full cursor-pointer`,
        on.click(fn),
        text
    );
}

function BaseCard(name, ...content) {
    return c(tw`flex px-[24px] py-[37px] gap-[37px] rounded-[19px] items-center border border-[#0000004c] bg-[#00000009]`,
        c(tw`text-[32px] font-medium leading-[39px]`, name),
        c(tw`flex-1`),
        content
    );
}

function LessonCard(lesson) {
    return BaseCard(lesson.name, CardButton('Открыть', _=>document.location.hash='#lesson/'+lesson.id));
}

function CourseCard(course) {
    return c(tw`flex px-[24px] py-[37px] gap-[37px] rounded-[19px] items-center border border-[#0000004c] bg-[#00000009]`,
        c(tw`text-[32px] font-medium leading-[39px]`, course.name),
        c(tw`flex-1`),
        !course.mine ?
            course.disabled ? DisabledCardButton('Набор закрыт')
                : CardButton('Записаться', _=> {
                    if (currentUser() == null) {
                        return document.location.hash = '#login';
                    }
                    data.userCourses.create({courseId: course.id, userId: currentUser()});
                    page(Router());
                })
        : [
            c(tw`text-[24px] font-medium leading-[29px]`, 'Урок ', course.lessonsComplited, '/', course.lessonsTotal),
            CardButton('Продолжить', _ => document.location.hash='#course/'+course.id)
        ]
        // : [
        //     CourseCardButton('Начать курс')
        // ]
        // : lessonsComplited < lessonsTotal
        //     ? [
        //         c(tw`text-[24px] font-medium leading-[29px]`, 'Урок ', lessonsComplited, '/', lessonsTotal),
        //         CourseCardButton('Продолжить')
        //     ]
        // : [
        //     c.Span(tw`text-[24px] font-medium leading-[29px] flex gap-[8px] items-center`, 'Пройден', c.Img(attr.src(complitedImageUrl))),
        //     CourseCardButton('Завершить и получить сертификат')
        // ]
    );
}

function calcLessonsCount(courseId) {
    return data.chapters.filter(ch => ch.courseId === courseId)
        .map(ch => data.lessons.filter(l => l.chapterId === ch.id).length)
        .reduce((a, b) => a+b, 0);
    
}

function Courses(filter) {
    let courses = [];
    const myCourses = new Set(data.userCourses.filter(uc => uc.userId === currentUser()).map(uc => uc.courseId))
    if (filter === 'my') {
        courses = data.courses.filter(c => myCourses.has(c.id));
    } else {
        courses = data.courses.filter(course => !filter || course.topic === filter);
    }
    courses = courses.map(c => {
        if (myCourses.has(c.id)) {
            return ({mine: true, lessonsComplited: 0, lessonsTotal: calcLessonsCount(c.id), ...c})
        }
        return c;
    });
    const coursesByTopic = data.groupBy(courses, 'topic');
    return Page(
        c(tw`flex`,
            c.H1(tw`text-[60px] leading-[68px] font-bold text-[#000] ml-[36px]`, 'Курсы'),
        ),
        c(tw`mt-[12px]`),
        c(tw`border border-[#dcdcdc] rounded-[37px] px-[17px] py-[26px] bg-white space-y-[48px]`,
            coursesByTopic.map(([topic, courses], i) => [
                c(tw`flex`, c(tw`flex-1`), RowHeader(data.topics.find(t => t.id === topic).name)),
                c(tw`space-y-[25px]`, courses.map(course => CourseCard(course)))
            ]),
            filter === 'my'
                && c(tw`flex gap-[24px] items-center`,
                    c(tw`flex-1`),
                    c(tw`text-[24px] leading-[34px]`, 'Запишитесь на новые курсы прямо сейчас'),
                    c.Button(
                        tw`text-[24px] leading-[29px] text-white rounded-full px-[18px] py-[8px] bg-[#0089EF] cursor-pointer`,
                        on.click(_ => document.location.hash = '#courses'),
                        'Каталог курсов')
                )
        )
    )
}

function Lesson(id) {
    const lesson = data.lessons.find(l => l.id === id);
    const chapter = data.chapters.find(ch => ch.id === lesson.chapterId);
    const course = data.courses.find(c => c.id === chapter.courseId);
    const user = data.users.find(u => u.id === currentUser());
    if (user.isTeacher) {
        const answers = data.answers.filter(a => a.lessonId === lesson.id).map(a => ({
            user: data.users.find(u => u.id === a.userId),
            ...a
        }));
        return Page(
            c(tw`flex`,
                c.H1(tw`text-[60px] leading-[68px] font-bold text-[#000] ml-[36px]`, course.name),
            ),
            c(tw`mt-[12px]`),
            c(tw`border border-[#dcdcdc] rounded-[37px] px-[45px] py-[26px] bg-white`,
                c(tw`flex items-center`, c.H2(tw`text-[40px] leading-[68px] font-semibold text-shadow-2`, lesson.name), c(tw`flex-1`), RowHeader('Урок '+(lesson.order+1))),
                answers.map(a => [
                    c.H2(tw`text-[24px] leading-[68px] font-semibold`,
                        `${a.user.surname} ${a.user.name[0].toLocaleUpperCase()}. ${a.user.patronym[0].toLocaleUpperCase()}. (${a.user.login})`
                    ),
                    c(tw`w-full rounded-[24px] min-h-[120px] border border-[#dcdcdc] text-[16px] px-[24px] py-[24px]`, a.comment)
                ])
            )
        )    
    }
    const answer = Val(data.answers.find(a => a.userId === currentUser() && a.lessonId == lesson.id)?.comment || '');
    return Page(
        c(tw`flex`,
            c.H1(tw`text-[60px] leading-[68px] font-bold text-[#000] ml-[36px]`, course.name),
        ),
        c(tw`mt-[12px]`),
        c(tw`border border-[#dcdcdc] rounded-[37px] px-[45px] py-[26px] bg-white`,
            c(tw`flex items-center`, c.H2(tw`text-[40px] leading-[68px] font-semibold text-shadow-2`, lesson.name), c(tw`flex-1`), RowHeader('Урок '+(lesson.order+1))),
            c(tw`p-[24px]`,
                c.Iframe(tw`w-full aspect-video rounded-[12px]`, attr.src(lesson.content)),
            ),
            lesson.task && [
                c(tw`flex items-center`, c(tw`flex-1`), RowHeader('Задание')),
                c.P(tw`leading-[68px] text-[28px] font-semibold`, lesson.task),
                c(tw`mt-[25px]`),
                c(tw`flex items-center`, c(tw`flex-1`), RowHeader('Решение')),
                c(tw`mt-[25px]`),
                TextInput(answer),
                c(tw`mt-[25px]`),
                c(tw`flex justify-center`,
                    BlueButton('Отправить', () => {
                        const found = data.answers.find(a => a.userId === currentUser() && a.lessonId == lesson.id);
                        if (!found) {
                            data.answers.create({ userId: currentUser(), lessonId: lesson.id, comment: answer() })
                        } else {
                            found.comment = answer();
                            data.answers.update();
                        }
                    })
                )
            ]
        )
    )
}

function Course(id) {
    const course = data.courses.find(c => c.id === id);
    const chapters = data.chapters.filter(ch => ch.courseId === id);
    return Page(
            c(tw`flex`,
            c.H1(tw`text-[60px] leading-[68px] font-bold text-[#000] ml-[36px]`, course.name),
        ),
        c(tw`mt-[12px]`),
        c(tw`border border-[#dcdcdc] rounded-[37px] px-[45px] py-[26px] bg-white space-y-[48px]`,
            chapters.map(ch => [
                c(tw`flex`, c(tw`flex-1`), RowHeader(ch.name)),
                c(tw`space-y-[25px]`, data.lessons.filter(l => l.chapterId === ch.id).map(LessonCard))
            ])
        )
    )
}

function Router() {
    const route = document.location.hash.slice(1);
    return route === ''
        ? MainPage
    : route === 'contacts'
        ? Contacts
    : route === 'login'
        ? Login()
    : route === 'register'
        ? Register()
    : route === 'ask'
        ? AskQuestion
    : route.startsWith('courses')
        ? Courses(route.slice(8))
    : route.startsWith('course')
        ? Course(Number(route.slice(7)))
    : route.startsWith('lesson')
        ? Lesson(Number(route.slice(7)))
    : route === 'agreement'
        ? UserAgreements
    : route == 'privacy'
        ? PrivacyPolicy
    : Page();
}

const page = Val(Router());
window.addEventListener('hashchange', () => page(Router()));

body(c.Body(tw`bg-[#f5f5f5]`, page));