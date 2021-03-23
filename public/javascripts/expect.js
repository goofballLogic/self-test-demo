function expect(actual) {

    return {
        actual,
        get to() {
            return this;
        },
        be(expected) {
            if (expected !== actual) throw new Error(`Expected ${JSON.stringify(expected)} but found ${JSON.stringify(actual)}`);
        }
    };

}

export default expect;