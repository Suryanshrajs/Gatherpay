const routeDescriptions = {
  "/login": "Log in a user",
  "/register": "Register a new user",
  "/logout": "Log out the current user",
  "/userInfo": "Get current user's information",
  "/isLoggedin": "Check if user is logged in",
  "/updatePersonalInfo": "Update user's personal info",
  "/createEvent": "Create a new event",
  "/getEvents": "Fetch all available events",
  "/event/:id": "Get, update, or delete a single event by ID",
  "/getEventsByOwner": "Get all events created by the current user",
  "/create-order": "Create a   payment  link for  the  event ",
  "/verify-payment":"check the  payment status and update event data"
};

export default function getRoutes(router) {
  const routes = [];

  router.stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods)
        .map((method) => method.toUpperCase())
        .join(", ");

      const path = `/api${layer.route.path}`;
      const description = routeDescriptions[layer.route.path] || "No description available";

      routes.push({
        method: methods,
        path,
        description,
      });
    }
  });

  return routes;
}
