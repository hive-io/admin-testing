# admin-testing
end to end testing for the admin dashboard

# installing
`npm install`

# running tests
if you don't already have gulp installed:
`npm install -g gulp`

then:
`gulp test`

# notes
if you only want to run a certain test then postfix the test's with `only`. You can do this
on suite-level (`describe.only`), or test-level (`it.only`). See the [mocha website](https://mochajs.org/)
for more information.
