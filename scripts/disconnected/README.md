The scripts in this directory are created to help automate some of the tasks
documented in the Satellite documentation. They are experimental and should be
used with caution. Please review them before using them. Especially compare them
to the what's in the documentation.


Disconnected Satellite (using a synchronization host)
-------------------------------------------------------

The main guide is located at:

https://access.redhat.com/documentation/en-US/Red_Hat_Satellite/6.0/html/User_Guide/sect-Disconnected_Satellite.html

1) Create a VM for use as the Synchronization Host with RHEL installed.
2) Register the VM with Customer Portal using subscription manager:

   ```subscription-manager register```

3) Find the pool id for Red Hat Satellite:

   ```subscription-manager list --available --all```

4) Download the manifest required for your Satellite.


5) Now you can run setup-sync.sh script from this repo:

   ```sudo setup-sync.sh POOL_ID MANIFEST_FILE```

6) You should now be able to begin syncing content for RHCI:

   ```sudo sync.sh```

7) Once the syncing is finished, you can then export said content:

   ```sudo export.sh PATH_FOR_EXPORT``` # path will be created for you

7.1) Fix the export to be consumable.

   ```sudo fix-export.sh PATH_FOR_EXPORT``` # path created in step 7

8) Once the content has been exported you can now sync it to the satellite.
   This will put all the content in /var/www/html/pub/sat-import/

   ```sudo setup-sat.sh```


Disconnected Satellite (using ISOs)
------------------------------------
TBD
