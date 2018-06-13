/**
 *
 * @enum {number}
 */
let RuleTypes = {
    required: 1,
    positive: 2,
    negative: 3,
    min: 4,
    max: 5,
    range: 6,
    not: 7,
    confirmed: 8,
    of: 9,
    not_of: 10,
    len: 11,
    format: 12,
    in_domain: 13,
    not_in_domain: 14,
    items: 15,
    ext: 16,
    pattern: 17,
    //single file
    s_min: 18,
    s_max: 19,
    s_range: 20,
    lite: 21,
    pre: 22
};

export default RuleTypes