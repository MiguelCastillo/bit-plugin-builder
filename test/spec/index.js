import { expect } from "chai";
import PluginBuilder from "../../index";

describe("bit-plugin-builder test suite", function() {
  describe("When building a plugin configuration", () => {
    var act, config, result;

    beforeEach(() => act = () => result = PluginBuilder(config).build());

    describe("and the configuration is empty", () => {
      beforeEach(() => {
        config = null;
        act();
      });

      it("then result is an object", () => {
        expect(result).to.be.an("object");
      });

      it("then result has default settings", () => {
        expect(result).to.deep.equal({
          resolve: [],
          fetch: [],
          pretransform: [],
          transform: [],
          dependency: [],
          precompile: [],
          extensions: []
        });
      });
    });

    describe("and the configuration has an ignore rule", () => {
      beforeEach(() => {
        config = {
          ignores: {
            name: "test"
          }
        };

        act();
      });

      it("then the result contains the ignore rule", () => {
        expect(result.ignores).to.deep.equal({
          name: ["test"]
        });
      });
    });
  });

  describe("When the plugin builder has default settings", () => {
    var act, defaultSettings, config, result;

    beforeEach(() => act = () => result = PluginBuilder.create(defaultSettings).configure(config).build());

    describe("and the default config has a default ignore for path, one transform, and one extension", () => {
      beforeEach(() => {
        defaultSettings = {
          transform: "first transform",
          extensions: "js",
          ignores: {
            name: "test"
          }
        };
      });

      describe("and configuring the plugin with two ignore name rule and one extension", () => {
        beforeEach(() => {
          config = {
            extensions: "jsx",
            ignores: {
              name: ["3", "of course"]
            }
          };

          act();
        });

        it("then the plugin has all aggregated ignore rule", () => {
          expect(result.ignores).to.deep.equal({
            name: ["test", "3", "of course"]
          });
        });

        it("then the plugin has all aggregated extension rule", () => {
          expect(result.extensions).to.deep.equal(["js", "jsx"]);
        });
      });

      describe("and configuring the plugin with two transforms", () => {
        beforeEach(() => {
          config = {
            transform: ["transform 2", {
              handler: "transform 3"
            }]
          };

          act();
        });

        it("then the plugin has the default transform as well as the two new transforms", () => {
          expect(result.transform).to.deep.equal(["first transform", "transform 2", { handler: "transform 3" }]);
        });
      });
    });
  });

  describe("When the plugin build has consecutive calls to configure", () => {
    var act, config1, config2, transforms1, transforms2, result;

    beforeEach(() => act = () => result = PluginBuilder.create().configure(config1).configure(config2).build());

    describe("and the first configuration has two transfoms in an array with no second configuration", () => {
      beforeEach(() => {
        transforms1 = [ function() {}, function() {} ];
        config1 = {
          transform: transforms1
        };

        config2 = null;
        act();
      });

      it("then there are two transforms in the result", () => {
        expect(result.transform).to.have.lengthOf(2);
      });

      it("then the result contains two functions", () => {
        expect(result.transform).to.eql(transforms1);
      });
    });

    describe("and the first configuration no first configuration and a second configuration with two transfoms in an array", () => {
      beforeEach(() => {
        transforms2 = [ function() {}, function() {} ];
        config1 = null;
        config2 = {
          transform: transforms2
        };

        act();
      });

      it("then there are two transforms in the result", () => {
        expect(result.transform).to.have.lengthOf(2);
      });

      it("then the result contains two functions", () => {
        expect(result.transform).to.eql(transforms2);
      });
    });

    describe("and the first configuration has two transfoms and the second config with two transforms", () => {
      beforeEach(() => {
        config1 = {
          transform: [ function() {}, function() {} ]
        };

        config2 = {
          transform: [ function() {}, function() {} ]
        };

        act();
      });

      it("then there are 4 transforms in the result", () => {
        expect(result.transform).to.have.lengthOf(4);
      });
    });
  });
});
