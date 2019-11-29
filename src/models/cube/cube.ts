import Vector from '../../math/vector';

export default class Cube {
	private vertex: number[];
	private index: number[];
	private normal: number[];
	private uv: number[];
	private tangent: number[];
	private bitangent: number[];

	public getData(): any {
		return {
			vertex: this.vertex,
			index: this.index,
			normal: this.normal,
			uv: this.uv,
			tangent: this.tangent,
			bitangent: this.bitangent
		};
	}

	constructor() {
		// prettier-ignore
		this.vertex = [
			// Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0,
		];
		// prettier-ignore
		this.index = [
			0, 1, 2, 0, 2, 3, // front
			4, 5, 6, 4, 6, 7, // back
			8, 9, 10, 8, 10, 11, // top
			12, 13, 14, 12, 14, 15, // bottom
			16, 17, 18, 16, 18, 19, // right
			20, 21, 22, 20, 22, 23, // left

		];

		this.calculateNormals();
		this.calculateTextureCoordinates();
		this.calculateTangent();
	}

	private calculateNormals() {
		let i,
			indexVertice1,
			indexVertice2,
			indexVertice3,
			indexVertice1Vertice,
			vertice1Coordinates,
			indexVertice2Vertice,
			vertice2Coordinates,
			indexVertice3Vertice,
			vertice3Coordinates,
			vec1,
			vec2,
			c,
			normalizedC;

		this.normal = [];
		for (let k = 0; k < this.vertex.length; k++) {
			this.normal.push(0);
		}
		for (i = 0; i < this.index.length / 3; i++) {
			indexVertice1 = this.index[i * 3];
			indexVertice2 = this.index[i * 3 + 1];
			indexVertice3 = this.index[i * 3 + 2];

			indexVertice1Vertice = indexVertice1 * 3;
			vertice1Coordinates = [
				this.vertex[indexVertice1Vertice],
				this.vertex[indexVertice1Vertice + 1],
				this.vertex[indexVertice1Vertice + 2]
			];

			indexVertice2Vertice = indexVertice2 * 3;
			vertice2Coordinates = [
				this.vertex[indexVertice2Vertice],
				this.vertex[indexVertice2Vertice + 1],
				this.vertex[indexVertice2Vertice + 2]
			];

			indexVertice3Vertice = indexVertice3 * 3;
			vertice3Coordinates = [
				this.vertex[indexVertice3Vertice],
				this.vertex[indexVertice3Vertice + 1],
				this.vertex[indexVertice3Vertice + 2]
			];

			vec1 = Vector.subtract(vertice2Coordinates, vertice1Coordinates);
			vec2 = Vector.subtract(vertice3Coordinates, vertice2Coordinates);

			c = Vector.cross(vec1, vec2);

			normalizedC = Vector.normalize(c);

			this.normal[indexVertice1] += normalizedC[0];
			this.normal[indexVertice1 + 1] += normalizedC[1];
			this.normal[indexVertice1 + 2] += normalizedC[2];

			this.normal[indexVertice2] += normalizedC[0];
			this.normal[indexVertice2 + 1] += normalizedC[1];
			this.normal[indexVertice2 + 2] += normalizedC[2];

			this.normal[indexVertice3] += normalizedC[0];
			this.normal[indexVertice3 + 1] += normalizedC[1];
			this.normal[indexVertice3 + 2] += normalizedC[2];
		}
	}

	private calculateTextureCoordinates() {
		// prettier-ignore
		this.uv = [
			0.0, 1.0, 1.0,1.0, 1.0,0.0, 0.0,0.0, // ront
			0.0,1.0, 1.0,1.0, 1.0,0.0, 0.0,0.0, // back
			0.0,1.0, 1.0,1.0, 1.0,0.0, 0.0,0.0, // top
			0.0,1.0, 1.0,1.0, 1.0,0.0, 0.0,0.0, // bottom
			0.0,1.0, 1.0,1.0, 1.0,0.0, 0.0,0.0, // let
			0.0,1.0, 1.0,1.0, 1.0,0.0, 0.0,0.0  // right
		];
	}

	private calculateTangent(): void {
		this.tangent = [];
		this.bitangent = [];
		for (let i = 0; i < this.index.length; i += 3) {
			const { tangent, bitangent } = this.calcTangentBitangent(
				this.iX(i, 0),
				this.iY(i, 0),
				this.iZ(i, 0),
				this.iX(i, 1),
				this.iY(i, 1),
				this.iZ(i, 1),
				this.iX(i, 2),
				this.iY(i, 2),
				this.iZ(i, 2),
				this.iU(i, 0),
				this.iV(i, 0),
				this.iU(i, 1),
				this.iV(i, 1),
				this.iU(i, 2),
				this.iV(i, 2)
			);
			this.tangent.push(tangent[0]);
			this.tangent.push(tangent[1]);
			this.tangent.push(tangent[2]);

			this.bitangent.push(bitangent[0]);
			this.bitangent.push(bitangent[1]);
			this.bitangent.push(bitangent[2]);
		}
	}

	private iX(index: number, nmb: number): number {
		return this.vertex[this.index[index + nmb] * 3 + 0];
	}

	private iY(index: number, nmb: number): number {
		return this.vertex[this.index[index + nmb] * 3 + 1];
	}

	private iZ(index: number, nmb: number): number {
		return this.vertex[this.index[index + nmb] * 3 + 2];
	}

	private iU(index: number, nmb: number): number {
		return this.uv[this.index[index + nmb] * 2 + 0];
	}

	private iV(index: number, nmb: number): number {
		return this.uv[this.index[index + nmb] * 2 + 1];
	}

	private calcTangentBitangent(
		x1: number,
		y1: number,
		z1: number,
		x2: number,
		y2: number,
		z2: number,
		x3: number,
		y3: number,
		z3: number,
		u1: number,
		v1: number,
		u2: number,
		v2: number,
		u3: number,
		v3: number
	): { tangent: number[]; bitangent: number[] } {
		const pos1 = [x1, y1, z1];
		const pos2 = [x2, y2, z2];
		const pos3 = [x3, y3, z3];

		const uv1 = [u1, v1];
		const uv2 = [u2, v2];
		const uv3 = [u3, v3];

		const edge1 = Vector.subtract(pos2, pos1);
		const edge2 = Vector.subtract(pos3, pos1);
		const deltaUV1 = Vector.subtract2(uv2, uv1);
		const deltaUV2 = Vector.subtract2(uv3, uv1);

		const f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

		let tangent = [
			f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
			f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
			f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])
		];
		tangent = Vector.normalize(tangent);

		let bitangent = [
			f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]),
			f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]),
			f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2])
		];
		bitangent = Vector.normalize(bitangent);
		return {
			tangent: tangent,
			bitangent: bitangent
		};
	}
}
