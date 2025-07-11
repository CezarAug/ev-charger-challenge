import { simulation, atOnceUsers, global, scenario, getParameter, StringBody } from "@gatling.io/core";
import { http} from "@gatling.io/http";

export default simulation((setUp) => {
  // Load VU count from system properties
  // Reference: https://docs.gatling.io/guides/passing-parameters/
  const vu = parseInt(getParameter("vu", "100"));

  // Define HTTP configuration
  // Reference: https://docs.gatling.io/reference/script/protocols/http/protocol/
  const httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json");

  // Define scenario
  // Reference: https://docs.gatling.io/reference/script/core/scenario/
  const scn = scenario("Scenario").exec(http("Session").post("/reserve")
    .body(StringBody(JSON.stringify({
        userId: Math.floor(Math.random() * 4) + 1,
        chargerId: 1,
        reservation_start: "3000-01-03 12:00:00",
        reservation_end: "3000-01-03 13:00:00"
      })))
    .asJson());
  // Define assertions
  // Reference: https://docs.gatling.io/reference/script/core/assertions/
  // const assertion = global().failedRequests().count().lt(1.0);

  // Define injection profile and execute the test
  // Reference: https://docs.gatling.io/reference/script/core/injection/
  setUp(scn.injectOpen(atOnceUsers(vu)))
    // .assertions(assertion)
    .protocols(httpProtocol);
});
