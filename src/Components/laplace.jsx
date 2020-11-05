// u=0
// b = GS/epsilion 
// const laplace = (b,x,u) => {
//  return ( (1/(2*b))* (Math.E**(- (Math.abs(x-u)/b) )))
// };
// console.log(laplace(1/0.01, -0.5,0));


function sgn(x) {
    return x < 0 ? -1 : 1;
}

// From wikipedia:
// Lap(X) = mu - b sgn(U) ln (1-2|U|) where U is a random variable between -0.5 and 0.5
// mu = mean , b = GS/e
function laplace(mu, b) {
    var U = Math.random() - 0.5;
    return mu - (b * sgn(U) * Math.log(1 - 2* Math.abs(U)));
}
// console.log(laplace(0,1/0.1));

export default laplace;
