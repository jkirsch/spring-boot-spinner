angular.module('spinner.directives', [])
    .directive('zodiac', function () {
        return {
            template: '<canvas id="zodiac"></canvas>',
            restrict: 'E',
            link: function postLink(scope, element) {
                'use strict';

                // start the animation
                new Zodiac(element.children()[0], // HTMLCanvasElement or id
                    {                             //// OPTIONS
                        directionX: 0,
                        directionY: -1,
                        velocityX: [0.1, 0.3],
                        velocityY: [0.3, 0.7],
                        bounceX: !0,
                        bounceY: !1,
                        parallax: 0.2,
                        pivot: 0,
                        density: 9999,
                        dotRadius: [1, 5],
                        linkColor: "#FFDAB9",
                        linkDistance: 55,
                        linkWidth: 2
                    });
            }
        };
    });