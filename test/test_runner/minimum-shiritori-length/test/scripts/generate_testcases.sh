generator="../../input"
dirs=("../in/basic" "../in/secret")
for dir in "${dirs[@]}"; do
    rm $dir/*.desc
    rm $dir/*.in
done
f=../in/basic/00_sample1.in; echo "generated " $f
echo "3" >> $f
echo "りんご" >> $f
echo "ごりら" >> $f
echo "らーめん" >> $f

f=../in/basic/00_sample2.in; echo "generated " $f
echo "3" >> $f
echo "りんご" >> $f
echo "ごりら" >> $f
echo "らくだ" >> $f

f=../in/basic/00_sample3.in; echo "generated " $f
echo "4" >> $f
echo "りんご" >> $f
echo "ごりら" >> $f
echo "らーめん" >> $f
echo "こすぃん" >> $f

f=../in/basic/01_exsmall1.in; echo "generated " $f
echo "1" >> $f
echo "りみ" >> $f

f=../in/secret/01_exsmall2.in; echo "generated " $f
echo "1" >> $f
echo "りむ" >> $f

f=../in/basic/01_exsmall3.in; echo "generated " $f
echo "1" >> $f
echo "りん" >> $f

for dir in "${dirs[@]}"; do
    casename=10_small2; base=${dir}/${casename}$i; ${generator} 2 -1 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=10_small3; base=${dir}/${casename}$i; ${generator} 20 -1 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=10_small4; base=${dir}/${casename}$i; ${generator} 100 100 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=10_small5; base=${dir}/${casename}$i; ${generator} 20 1 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=10_small6; base=${dir}/${casename}$i; ${generator} 30 30 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=10_small7; base=${dir}/${casename}$i; ${generator} 50 3 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=10_small8; base=${dir}/${casename}$i; ${generator} 30 13 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=10_small9; base=${dir}/${casename}$i; ${generator} 74 45  > ${base}.in 2> ${base}.desc; echo "generated " $casename

    casename=30_medium1; base=${dir}/${casename}$i; ${generator} 1000 -1 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=30_medium2; base=${dir}/${casename}$i; ${generator} 1000 1 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=30_medium3; base=${dir}/${casename}$i; ${generator} 1000 10 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=30_medium4; base=${dir}/${casename}$i; ${generator} 1000 60 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=40_large1; base=${dir}/${casename}$i; ${generator} 100000 -1 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=40_large2; base=${dir}/${casename}$i; ${generator} 100000 1 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=40_large3; base=${dir}/${casename}$i; ${generator} 100000 3 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=40_large4; base=${dir}/${casename}$i; ${generator} 100000 50 > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=40_large5; base=${dir}/${casename}$i; ${generator} 100000 10 > ${base}.in 2> ${base}.desc; echo "generated " $casename

    casename=50_random1; base=${dir}/${casename}$i; ${generator} 3 0 R > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=50_random2; base=${dir}/${casename}$i; ${generator} 10 0 R > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=50_random3; base=${dir}/${casename}$i; ${generator} 30 0 R > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=50_random4; base=${dir}/${casename}$i; ${generator} 100 0 R > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=50_random5; base=${dir}/${casename}$i; ${generator} 1000 0 R > ${base}.in 2> ${base}.desc; echo "generated " $casename
    casename=50_random6; base=${dir}/${casename}$i; ${generator} 100000 0 R > ${base}.in 2> ${base}.desc; echo "generated " $casename
done
