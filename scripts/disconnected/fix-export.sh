#!/bin/sh

die () {
    echo >&2 "$@"
    exit 1
}

fix_listing_files () {
    local DIR=$1
    local LISTING_FILE=$1/listing
    local RECURSE=$2

    if [ "$RECURSE" == true ] ; then
        for item in `ls $DIR | grep -v listing`; do
            if [ -n $item ] && [ -d $DIR/$item ]; then
                fix_listing_files $DIR/$item true
            fi
        done
    fi

    # only write out the listing for directories with directories in them
    local listing=`ls $DIR | grep -v listing`
    if [ "$listing" != "" ]; then
        echo "$listing" > $LISTING_FILE
        echo "Created/updated $LISTING_FILE"
    fi
}

#
# MAIN
#

EXPORT_DIR="$1"

# verify param
[ "$#" -eq 1 ] || die "1 argument required, $# provided"

[ -d "$EXPORT_DIR" ] || die "Directory does not exist"

# mv RHEL 6 content to 6Server
# DO NOT MOVE kickstart
for dir in "jbeap" "os" "rhevm" "rhev-mgmt-agent" "supplementary"; do
    echo "Moving $EXPORT_DIR/content/dist/rhel/server/6/6.7/x86_64/$dir to $EXPORT_DIR/content/dist/rhel/server/6/6Server/x86_64/"
    mv $EXPORT_DIR/content/dist/rhel/server/6/6.7/x86_64/$dir $EXPORT_DIR/content/dist/rhel/server/6/6Server/x86_64/
done

# fix cf-me listing files
fix_listing_files $EXPORT_DIR/content/dist/rhel/server/6/6.7/x86_64/
fix_listing_files $EXPORT_DIR/content/dist/rhel/server/6/6Server/x86_64/

# fix cf-me image files
mkdir -p $EXPORT_DIR/content/dist/cf-me/server/5.5/x86_64/files/
mkdir -p $EXPORT_DIR/content/dist/cf-me/server/5.4/x86_64/files/

echo "Moving cf-me-5_5-for-rhel-7-files--x86_64/* to $EXPORT_DIR/content/dist/cf-me/server/5.5/x86_64/files/"
mv cf-me-5_5-for-rhel-7-files--x86_64/* $EXPORT_DIR/content/dist/cf-me/server/5.5/x86_64/files/

echo "Moving cf-me-5_4-for-rhel-6-files--x86_64/* to $EXPORT_DIR/content/dist/cf-me/server/5.4/x86_64/files/"
mv cf-me-5_4-for-rhel-6-files--x86_64/* $EXPORT_DIR/content/dist/cf-me/server/5.4/x86_64/files/

# fix openstack directory files
mkdir -p $EXPORT_DIR/content/dist/rhel/server/7/7Server/x86_64/openstack-director/7.0/files/
echo "Moving rhel-7-server-openstack-7_0-files-7Server-x86_64/* to $EXPORT_DIR/content/dist/rhel/server/7/7Server/x86_64/openstack-director/7.0/files/"
mv rhel-7-server-openstack-7_0-files-7Server-x86_64/* $EXPORT_DIR/content/dist/rhel/server/7/7Server/x86_64/openstack-director/7.0/files/

# recursively fix openstack listing files
fix_listing_files $EXPORT_DIR/content/dist/rhel/server/7/7Server/x86_64/openstack-director/7.0/ true
