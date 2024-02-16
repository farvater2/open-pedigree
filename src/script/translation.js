
import PedigreeEditorParameters from 'pedigree/pedigreeEditorParameters';


let translate_value;
let dictionary = {
    'Gender': 'Пол',
    'Male': 'Мужской',
    'Female': 'Женский',
    'Unknown': 'Неизв.',
    'First name': 'Имя',
    'Last name': 'Фамилия',
    'Patronymic': 'Отчество',
    'Identifier': 'ID в МИС',
    'Patient in registry': 'Пациент в регистре',
    'Carrier status': 'Статус носителя',
    'Not affected': 'Не затронут',
    'Carrier': 'Носитель',
    'Affected': 'Пораженный',
    'Pre-symptomatic': 'Предсимптомный',
    'Documented evaluation': 'Подтверждены документально',
    'Disorders': 'Нарушения',
    'Genes': 'Гены',
    'Phenotypic features': 'Фенотипические особенности',
    'Date of birth': 'Дата рождения',
    'Date of death': 'Дата смерти',
    'Individual is': 'Человек...',
    'Alive': 'Живой',
    'Stillborn': 'Мерт.рожд.',
    'Deceased': 'Умерший',
    'Miscarriage': 'Выкидыш',
    'Unborn': 'Нерожд.',
    'Aborted': 'Абортир.',
    'Gestation age': 'Срок беременности',
    'Heredity options': 'Потомство',
    'None': 'Ни один',
    'Childless': 'Бездетный',
    'Infertile': 'Бесплодный',
    'Adopted': 'Приёмный ребенок',
    'Monozygotic twin': 'Монозиготные близнецы',
    'Not in contact with proband': 'Не контактировал с пробандом',
    'Placeholder node': 'Плейсхолдер',
    'Comments': 'Комментарии',
    'Number of persons in this group': 'Количество человек в этой группе',
    'Identifier(s)': 'Идентификаторы',
    'Known disorders<br>(common to all individuals in the group)': 'Известные расстройства<br>(общие для всех лиц в группе)',
    'All individuals in the group are': 'Каждый человек в группе...',
    'Consanguinity of this relationship': 'Близость этих отношений',
    'Automatic': 'Автоматич.',
    'Yes': 'Да',
    'No': 'Нет',
    'Separated': 'Отдаление или развод',
    'Personal': 'Личные',
    'Clinical': 'Клинические',
    'Candidate Genes': 'Гены-кандидаты',
    'Phenotypes': 'Фенотипы',
    'Patients': 'Пациенты',

    'Please select a pedigree template': 'Пожалуйста, выберите шаблон родословной',
    'Loading list of templates...': 'Загрузка списка шаблонов...',
    'Loading...': 'Загрузка...',

    'Proband': 'Пробанд',
    'Proband with parents': 'Пробанд с родителями',
    'Proband with two generations of ancestors': 'Пробанд с двумя поколениями предков',
    'Consanguineous marriage - cousins': 'Кровный брак - кузены',

    'Unsuported browser mode': 'Неподдерживаемый режим браузера',
    'Export': 'Экспорт',
    'Close': 'Закрыть',
    'Templates': 'Шаблоны',
    'Import': 'Импорт',
    'Undo': 'Отменить',
    'Redo': 'Повторить',
    'Clear all': 'Очистить все',
    'Save': 'Сохранить',
    'Load': 'Загрузить',

    'Import data:': 'Данные<br>для импорта:',
    'Pedigree import': 'Импорт родословной',
    'Nothing to import!': 'Нечего импортировать!',
    '(<a>Select a local file to be imported</a>)': '(<a>Выберите локальный файл для импорта</a>)',
    'Data format:': 'Формат данных:',
    'Treat non-standard phenotype values as new disorders': 'Относитесь к нестандартным значениям фенотипа как к новым нарушениям',
    'Treat non-standard phenotype values as "no information"': 'Относитесь к нестандартным значениям фенотипа как к "отсутствию информации"',
    'Mark all patients with known disorder status with \'documented evaluation\' mark': 'Отметьте всех пациентов с известным статусом расстройства пометкой "документированная оценка"',
    'Save individual IDs as given in the input data as \'external ID\'': 'Сохраните отдельные идентификаторы, указанные во входных данных, как "внешний идентификатор"',
    'Options:': 'Параметры:',
    'Cancel': 'Отмена',
    'Which of the following fields should be used to generate person IDs?': 'Какое из следующих полей следует использовать для создания идентификаторов пользователей?',
    'External ID': 'Внешний ID',
    'Name': 'Имя',
    'None, generate new numeric ID for everyone': 'Нет, сгенерируйте новый числовой идентификатор для всех',
    'Privacy export options:': 'Параметры экспорта конфиденциальности:',
    'All data': 'Все данные',
    'Remove personal information (name and age)': 'Удалить личную информацию (имя и возраст)',
    'Remove personal information and free-form comments': 'Удалять личную информацию и комментарии в свободной форме',
    'PDF export options:': 'Параметры экспорта PDF:',
    'Page Size ': 'Размер страницы ',
    'Page Orientation ': 'Ориентация страницы ',
    'Landscape': 'Альбомная',
    'Portrait': 'Портретная',
    'Legend Position ': 'Положение легенды ',
    'Top Left': 'Вверху слева',
    'Top Right': 'Вверху справа',
    'Bottom Left': 'Внизу слева',
    'Bottom Right': 'Внизу справа',
    'Pedigree export': 'Экспорт родословной',
    'Pedigree load': 'Загрузка родословной',
    'Pedigree settings': 'Настройка родословной',
    'Click to create a sibling or drag to an existing parentless person (valid choices will be highlighted in green)': 'Нажмите, чтобы создать брата или сестру, или перетащите к существующему лицу без родителей (допустимые варианты будут выделены зеленым цветом)',
    'Click to create new nodes for the parents or drag to an existing person or partnership (valid choices will be highlighted in green). Dragging to a person will create a new relationship.': 'Нажмите, чтобы создать новые узлы для родителей, или перетащите их к существующему человеку или партнерству (допустимые варианты будут выделены зеленым цветом). Перетаскивание к человеку создаст новые отношения.',
    'Click to create a new child node or drag to an existing parentless person (valid choices will be highlighted in green)': 'Нажмите, чтобы создать новый дочерний узел, или перетащите его к существующему лицу без родителей (допустимые варианты будут выделены зеленым цветом)',
    'Click to create a new partner node or drag to an existing node (valid choices will be highlighted in green)': 'Нажмите, чтобы создать новый партнерский узел, или перетащите его на существующий узел (допустимые варианты будут выделены зеленым цветом)',
    'remove node': 'удалить узел',
    'node properties': 'свойства узла',
    'Create a person of male gender': 'Создать человека мужского пола',
    'Create a person of female gender': 'Создать человека женского пола',
    'Create a person of unknown gender': 'Создать человека неизвестного пола',
    'Create twins (expandable to triplets or more)': 'Создавайте близнецов (с возможностью расширения до тройняшек и более)',
    'Create a node representing multiple siblings': 'Создайте узел, представляющий несколько братьев и сестер',
    'Mark as childless by choice': 'Отметить как бездетный по выбору',
    'Mark as infertile': 'Отметить как бесплодный',
    'show more options': 'показать больше вариантов',
    'create': 'создать',
    'case': 'случ.',
    'cases': 'случ.',
    'b. ': 'г.р. ',
    'd. ': 'г.с. ',
    'not born yet': 'еще не родился',
    ' day': ' дн.',
    ' days': ' дн.',
    ' wk': ' нед.',
    ' mo': ' мес.',
    //' y': ' л.',
    //' year': ' год',
    //' years': plural(translate_value, ' год', ' года', ' лет'),
    ' weeks': ' нед.',
    'week': 'нед.',
    'weeks': 'нед.',
    'Settings': 'Настройки',
    'Show LastName and FirstName': 'Показывать фамилию и имя',
    'Show generation number': 'Показывать номер поколения',
    'Show sequence number inside the generation': 'Показывать порядковый номер внутри поколения',
    'Copy URL': 'Копировать ссылку',
    'All highlighted nodes will be removed. Do you want to proceed?': 'Все выделенные узлы будут удалены. Вы хотите продолжить?',
    'Sorry, download file could not be created.': 'Извините, не удалось создать файл загрузки.',
    'Calculate the age for the current date': 'Вычислять возраст на текущую дату',
    'Calculate the age on a certain date:': 'Вычислять возраст на определенную дату:',
    'Age is calculated on ': 'Возраст вычисляется на ',
    'Age': 'Возраст',
    'This person already has the specified disorder': 'У этого человека уже есть указанное расстройство',
    'This person doesn\'t have the specified disorder': 'У этого человека нет указанного расстройства',
    'This person already has the specified phenotype': 'У этого человека уже есть указанный фенотип',
    'This person doesn\'t have the specified HPO term': 'У этого человека уже нет указанного фенотипа'

};

// функция для склонения слов (значение, (1)"день", (2)"дня", (5)"дней")
function plural(n, str1, str2, str5) {
    return ((((n % 10) == 1) && ((n % 100) != 11)) ? (str1) : (((((n % 10) >= 2) && ((n % 10) <= 4)) && (((n % 100) < 10) || ((n % 100) >= 20))) ? (str2) : (str5)));
}

function getWordFromDictionary(string, value) {
    if (typeof value === "undefined") {
        return dictionary[string] || string;
    } else if (string === 'years') {
        return plural(value, 'год', 'года', 'лет');
    } else if (string === ' y') {
        return plural(value, ' год', ' года', ' лет');
    }
    return dictionary[string] || string;
}


let translate = function (string, value) {
    let language = PedigreeEditorParameters.getSetting('language');
    if (language === 'eng') {
        return string;
    }
    return getWordFromDictionary(string, value);
};


export { translate };