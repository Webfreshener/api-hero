/**
 * String Inflection utility used to convert Class/Collection Names
 * @param $scope
 */
export default ($scope) => {
    $scope.Inflection = new (() => {
        return {
            // Holder for array of words that can not be pluralized
            __uncountable_words: [
                "equipment", "information", "rice", "money", "species",
                "series", "fish", "sheep", "moose", "deer", "news"],
            // Holder for RegExp pluralization rules
            __plural_rules: [
                [/(m)an$/gi, "$1en"],
                [/(pe)rson$/gi, "$1ople"],
                [/(child)$/gi, "$1ren"],
                [/^(ox)$/gi, "$1en"],
                [/(ax|test)is$/gi, "$1es"],
                [/(octop|vir)us$/gi, "$1i"],
                [/(alias|status)$/gi, "$1es"],
                [/(bu)s$/gi, "$1ses"],
                [/(buffal|tomat|potat)o$/gi, "$1oes"],
                [/([ti])um$/gi, "$1a"],
                [/sis$/gi, "ses"],
                [/(?:([^f])fe|([lr])f)$/gi, "$1$2ves"],
                [/(hive)$/gi, "$1s"],
                [/([^aeiouy]|qu)y$/gi, "$1ies"],
                [/(x|ch|ss|sh|lens)$/gi, "$1es"],
                [/(matr|vert|ind)ix|ex$/gi, "$1ices"],
                [/([m|l])ouse$/gi, "$1ice"],
                [/(quiz)$/gi, "$1zes"],
                [/s$/gi, "s"],
                [/$/gi, "s"]
            ],

            /**
             * Applies the appropriate RegExp for the provided string
             * @param str
             * @param rules
             * @param skip
             * @returns {*}
             */
            apply_rules(str, rules, skip) {
                // skips any string that is detected on `skip` array
                if ((skip.indexOf(str.toLowerCase())) === -1) {
                    // returns string with `rules` applied
                    let rx;
                    if ((rx = _.find(rules, itm => str.match(itm[0]))) != null) {
                        return str.replace(rx[0], rx[1]);
                    }
                }
                // returns inoperable string
                return str;
            },

            /**
             * pluralizes provided string
             * @param str - string to pluralize
             * @returns {*}
             */
            pluralize(str) {
                // returns results of `apply_rules`
                return this.apply_rules(str, this.__plural_rules, this.__uncountable_words);
            }
        };
    });
}