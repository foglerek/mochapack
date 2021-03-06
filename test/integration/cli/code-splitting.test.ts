/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai'
import path from 'path'
import normalizePath from 'normalize-path'
import exec from './util/childProcess'

const fixtureDir = path.relative(process.cwd(), path.join(__dirname, 'fixture'))
const binPath = path.relative(process.cwd(), path.join('bin', '_mocha'))

describe('code-splitting', function() {
  context('with static require', function() {
    before(function() {
      this.passingTest = normalizePath(
        path.join(fixtureDir, 'code-splitting/test/lazy-load-entry-static.js')
      )
      this.webpackConfig = normalizePath(
        path.join(fixtureDir, 'code-splitting/webpack.config-test.js')
      )
    })
    it('runs successful test', function(done) {
      exec(
        `node ${binPath}  --webpack-config "${this.webpackConfig}" "${this.passingTest}"`,
        (err, output) => {
          assert.isNull(err)
          assert.include(output, 'entry1.js')
          assert.include(output, 'entry2.js')
          assert.include(output, '1 passing')
          done()
        }
      )
    })
  })

  context('with dynamic require', function() {
    before(function() {
      this.passingTest = normalizePath(
        path.join(fixtureDir, 'code-splitting/test/lazy-load-entry-dynamic.js')
      )
      this.webpackConfig = normalizePath(
        path.join(fixtureDir, 'code-splitting/webpack.config-test.js')
      )
    })
    it('runs successfull test', function(done) {
      exec(
        `node ${binPath}  --webpack-config "${this.webpackConfig}" "${this.passingTest}"`,
        (err, output) => {
          assert.isNull(err)
          assert.include(output, 'entry1.js')
          assert.notInclude(output, 'entry2.js')
          assert.include(output, '1 passing')
          done()
        }
      )
    })
  })

  context(
    'with dynamic require (self referencing require statements)',
    function() {
      before(function() {
        this.passingTest = normalizePath(
          path.join(fixtureDir, 'code-splitting/test/cyclic-load-entry.js')
        )
        this.webpackConfig = normalizePath(
          path.join(fixtureDir, 'code-splitting/webpack.config-test.js')
        )
      })

      it('runs successfull test with cylic dependencies (entry matches itself)', function(done) {
        exec(
          `node ${binPath}  --webpack-config "${this.webpackConfig}" "${this.passingTest}"`,
          (err, output) => {
            assert.isNull(err)
            assert.include(output, 'entry1.js')
            assert.notInclude(output, 'entry2.js')
            assert.include(output, '1 passing')
            done()
          }
        )
      })
    }
  )

  context('without any require statements (empty require.ensure)', function() {
    before(function() {
      this.passingTest = normalizePath(
        path.join(fixtureDir, 'code-splitting/test/lazy-load-none.js')
      )
      this.webpackConfig = normalizePath(
        path.join(fixtureDir, 'code-splitting/webpack.config-test.js')
      )
    })
    it('runs successfull test', function(done) {
      exec(
        `node ${binPath}  --webpack-config "${this.webpackConfig}" "${this.passingTest}"`,
        (err, output) => {
          assert.isNull(err)
          assert.include(output, '1 passing')
          done()
        }
      )
    })
  })
})
