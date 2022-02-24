import { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
import parseDice, { asNumber } from "./parser.ts";

Deno.test("1dX", () => {
  assertEquals(parseDice(["2"]), "1d2");
  assertEquals(parseDice(["4"]), "1d4");
  assertEquals(parseDice(["6"]), "1d6");
  assertEquals(parseDice(["8"]), "1d8");

  assertEquals(parseDice(["0"]), "1d10");
  assertEquals(parseDice(["9"]), "9d");
  assertEquals(parseDice(["1"]), "1d");
  assertEquals(parseDice(["a"]), null);
  assertEquals(parseDice(["Enter"]), null);
});

Deno.test("1dXX", () => {
  assertEquals(parseDice(["1", "0"]), "1d10");
  assertEquals(parseDice(["2", "0"]), "1d20");
  assertEquals(parseDice(["0", "0"]), "1d100");
});

Deno.test("XdX", () => {
  assertEquals(parseDice(["2", "2"]), "2d2");
  assertEquals(parseDice(["3", "4"]), "3d4");
  assertEquals(parseDice(["9", "8"]), "9d8");
  assertEquals(parseDice(["3", "3"]), "33d");
});

Deno.test("XO", () => {
  assertEquals(parseDice(["1", "0"]), "1d10");
  assertEquals(parseDice(["2", "0"]), "1d20");
  assertEquals(parseDice(["3", "0"]), "3d10");
  assertEquals(parseDice(["4", "0"]), "4d10");
  assertEquals(parseDice(["9", "0"]), "9d10");
});

Deno.test("X00", () => {
  assertEquals(parseDice(["3", "0", "0"]), "3d100");
  assertEquals(parseDice(["9", "0", "0"]), "9d100");
});

Deno.test("XdX0", () => {
  assertEquals(parseDice(["9", "1", "0"]), "9d10");
  assertEquals(parseDice(["4", "2", "0"]), "4d20");
});

Deno.test("asNumber", () => {
  assertEquals(asNumber([1, 0, 0]), 100);
  assertEquals(asNumber([3, 0]), 30);
});

Deno.test("XXO", () => {
  assertEquals(parseDice(["9", "9", "0"]), "99d10");
});

Deno.test("XXX", () => {
  assertEquals(parseDice(["9", "1", "2"]), "9d12");
  assertEquals(parseDice(["9", "1", "4"]), "91d4");
  assertEquals(parseDice(["8", "8", "8"]), "88d8");
  assertEquals(parseDice(["9", "1", "0", "0"]), "9d100");
  assertEquals(parseDice(["8", "1", "2", "4"]), "812d4");
  assertEquals(parseDice(["8", "1", "2", "0"]), "81d20");
});

Deno.test("X1", () => {
  assertEquals(parseDice(["9", "1"]), "9d10");
  assertEquals(parseDice(["9", "1", "0"]), "9d10");
});

Deno.test("XX1", () => {
  assertEquals(parseDice(["3", "1", "1"]), "31d10");
});

Deno.test("X0X", () => {
  assertEquals(parseDice(["1", "0", "4"]), "10d4");
});
