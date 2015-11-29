// The Spinner app

var translations_EN = {
    TITLE : 'Random Name Selector',
    ADD: 'Add a new label',
    EMPTY_TEXT: 'Enter something',
    NAME: 'Name',
    SELECTED: '# Selected',
    SPIN: 'randomize',
    WINNER: 'selected',
    CLIENTS: 'Currently we have {{ clients }} client(s).'
};

var translations_DE = {
    TITLE : 'Zufallsnamen Wählscheibe',
    ADD: 'Namen hinzufügen',
    EMPTY_TEXT: 'Text eingeben',
    NAME: 'Name',
    SELECTED: '# Ausgewählt',
    SPIN: 'Drehen',
    WINNER: 'Ausgewählt',
    CLIENTS: 'Es schauen gerade: {{ clients }} zu.'
};

var myApp = angular.module('spinner', [
    'spinner.controllers', 'spinner.directives', 'ngAnimate', 'pascalprecht.translate'
]).config(function ($translateProvider) {

    // Register translations

    $translateProvider
        .translations('en', translations_EN)
        .translations('de', translations_DE)
        .registerAvailableLanguageKeys(['en', 'de'], {
            'en-*': 'en',
            'de-*': 'de'
        })
        .useSanitizeValueStrategy('escape')
        .uniformLanguageTag('bcp47')
        .determinePreferredLanguage()
        .fallbackLanguage('en');
});
