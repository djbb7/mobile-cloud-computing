/** Class representing a 2D point. */
class Point
{
	/**
     * Create a point
     * @param {number} lat - Latitude of the point.
     * @param {number} lon - Longitude of the point.
	 */
	constructor(lat, lon)
	{
		this.lat = lat;
		this.lon = lon;
	}

	/**
	 * Calculates p2's relative position to line
	 * defined by p0 and p1.
	 * @param {Point} p0 - Start position of line.
	 * @param {Point} p1 - End position of line.
	 * @param {Point} p2 - Position that should be checked.
	 * @return {number} > 0 if p2 is left of the line,
	 *                  < 0 if p2 is right of the line,
	 *                  = 0 if p2 is on the line.
	 */
	static isLeft(p0, p1, p2)
	{
		return (p1.lon - p0.lon) * (p2.lat - p0.lat) - (p2.lon - p0.lon) * (p1.lat - p0.lat);
	}
}

/** Class representing a polygon that consists of 2D points */
class Polygon
{
	/*
	 * Create a polygon.
	 * @param {Point[]} points - The points defining a polygon.
	 */
	constructor(points)
	{
		this.points = points;
		this.topLeft = new Point(points[0].lat, points[0].lon);
		this.bottomRight = new Point(points[0].lat, points[0].lon);

		// Calculate bounding box for the polygon for cheaper inclusion checking.
		for(var i = 0; i < this.points.length; ++i)
		{
			var p = this.points[i];

			this.topLeft.lat = Math.max(this.topLeft.lat, p.lat);
			this.topLeft.lon = Math.min(this.topLeft.lon, p.lon);
			this.bottomRight.lat = Math.min(this.bottomRight.lat, p.lat);
			this.bottomRight.lon = Math.max(this.bottomRight.lon, p.lon);
		}
	}

	/*
	 * Calculates how many times polygon winds around point.
	 * @param {Point} point - The point to calculate winding number for.
	 * @return {number} Number of times the polygon winds around point.
	 */
	windingNumber(point)
	{
		var wn = 0;
		for(var i = 0; i < this.points.length; ++i)
		{
			var p0 = this.points[i];
			var p1 = this.points[(i + 1) % this.points.length];

			if(p0.lat < point.lat && p1.lat > point.lat)
			{
				if(Point.isLeft(p0, p1, point) > 0)
					wn++;
			}
			else if(p0.lat > point.lat && p1.lat < point.lat)
			{
				if(Point.isLeft(p0, p1, point) < 0)
					wn--;
			}
		}

		return wn;
	}

	/*
	 * Checks if point is inside the polygon.
	 * @param {Point} point - The point to be tested
	 * @return {boolean} true if point is inside the polygon,
	 *                   false otherwise.
	 */
	isInside(point)
	{
		// Check against bounding box to avoid more expensive check
		if(point.lon < this.topLeft.lon || point.lon > this.bottomRight.lon || point.lat > this.topLeft.lat || point.lat < this.bottomRight.lat)
		{
			return false;
		}

		// If polygon winds around point, the point is inside it
		return this.windingNumber(point) != 0;
	}
}

var t_building = new Polygon([
	new Point(60.18696, 24.82048),
	new Point(60.18729, 24.82060),
	new Point(60.18729, 24.82058),
	new Point(60.18736, 24.82062),
	new Point(60.18730, 24.82100),
	new Point(60.18723, 24.82095),
	new Point(60.18712, 24.82167),
	new Point(60.18698, 24.82254),
	new Point(60.18657, 24.82228),
	new Point(60.18669, 24.82180),
	new Point(60.18683, 24.82031),
	new Point(60.18688, 24.82032),
	new Point(60.18687, 24.82036),
	new Point(60.18689, 24.82036),
	new Point(60.18689, 24.82034),
	new Point(60.18697, 24.82036),
])

/*console.log(t_building.isInside(new Point(50.187290, 20.0250000))); // out
console.log(t_building.isInside(new Point(60.186788, 24.8213108))); // in
console.log(t_building.isInside(new Point(60.186965, 24.8208829))); // in
console.log(t_building.isInside(new Point(60.187236, 24.820980))); // out
console.log(t_building.isInside(new Point(60.187293, 24.820591))); // in
console.log(t_building.isInside(new Point(60.187284, 24.820589))); // out
console.log(t_building.isInside(new Point(60.186882, 24.820354))); // out*/

exports.t_building = t_building;
exports.Point = Point;
exports.Polygon = Polygon;
