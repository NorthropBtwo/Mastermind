class Random {
    public static RangeInt(minInc: number, maxExc: number): number {
        return Math.floor(Math.random() * (maxExc - minInc)) + minInc;
    }
}
